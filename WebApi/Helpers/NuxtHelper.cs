using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics;
using System.IO;
using System.Net.NetworkInformation;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Linq;
using Serilog;
using Microsoft.Extensions.Configuration;
using Serilog.Events;

namespace WebApi.Helpers
{
    public static class NuxtHelper
    {
        // default port number of 'npm run dev'
        private static int Port { get; } = 3000;
        private static Uri DevelopmentServerEndpoint { get; } = new Uri($"http://localhost:{Port}");
        private static TimeSpan Timeout { get; } = TimeSpan.FromSeconds(30);
        // done message of 'npm run dev' command.
        private static string DoneMessage { get; } = "DONE  Compiled successfully in";

        public static void UseNuxtDevelopmentServer(this ISpaBuilder spa)
        {
            var uri = RunNuxt(spa);

            spa.UseProxyToSpaDevelopmentServer(uri);

        }

        private static bool IsRunning() => IPGlobalProperties.GetIPGlobalProperties()
                .GetActiveTcpListeners()
                .Select(x => x.Port)
                .Contains(Port);

        private static Uri RunNuxt(ISpaBuilder spa)
        {
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(config).CreateLogger();
            Log.Information("Start Nuxt");
            // if 'npm dev' command was executed yourself, then just return the endpoint.
            if (IsRunning())
            {
                return DevelopmentServerEndpoint;
            }

            // launch Nuxt development server
            var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
            var processInfo = new ProcessStartInfo
            {
                FileName = isWindows ? "cmd" : "npm",
                Arguments = $"{(isWindows ? "/c npm " : "")}run dev",
                WorkingDirectory = "Client",
                RedirectStandardError = true,
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                UseShellExecute = false,
            };
            var process = Process.Start(processInfo);
            var tcs = new TaskCompletionSource<int>();
            _ = Task.Run(() =>
            {
                try
                {
                    string line;
                    while ((line = process.StandardOutput.ReadLine()) != null)
                    {
                        Log.Information(line);
                        if (!tcs.Task.IsCompleted && line.Contains(DoneMessage))
                        {
                            tcs.SetResult(1);
                        }
                    }
                }
                catch (EndOfStreamException ex)
                {
                    Log.Error(ex.ToString());
                    tcs.SetException(new InvalidOperationException("'npm run dev' failed.", ex));
                }
            });
            _ = Task.Run(() =>
            {
                try
                {
                    string line;
                    while ((line = process.StandardError.ReadLine()) != null)
                    {
                        Log.Information(line);
                    }
                }
                catch (EndOfStreamException ex)
                {
                    Log.Error(ex.ToString());
                    tcs.SetException(new InvalidOperationException("'npm run dev' failed.", ex));
                }
            });

            var timeout = Task.Delay(Timeout);
            if (Task.WhenAny(timeout, tcs.Task) == timeout)
            {
                throw new TimeoutException();
            }

            return DevelopmentServerEndpoint;
        }
    }
}
