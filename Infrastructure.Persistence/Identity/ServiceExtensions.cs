﻿using Application.Interfaces;
using Application.Wrappers;
using Domain.Entities.Role;
using Domain.Settings;
using Infrastructure.Identity.Models;
using Infrastructure.Identity.Models.Permisson;
using Infrastructure.Identity.Models.User;
using Infrastructure.Identity.Permission;
using Infrastructure.Identity.Services;
using Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Text;

namespace Infrastructure.Identity
{
    public static class ServiceExtensions
    {
        public static void AddIdentityInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            //if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            //{
            //    services.AddDbContext<IdentityContext>(options =>
            //        options.UseInMemoryDatabase("IdentityDb"));
            //}
            //else
            //{
            //    services.AddDbContext<IdentityContext>(options =>
            //    options.UseNpgsql(
            //        configuration.GetConnectionString("IdentityConnection"),
            //        b => b.MigrationsAssembly(typeof(IdentityContext).Assembly.FullName)));
            //}

            services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
            services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
            services.AddIdentity<ApplicationUser, Role>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

            services.AddAuthorization(options =>
            {
                //foreach (var permission in Permissions.Products)
                //{
                //options.AddPolicy(permission.Name, policy => policy.Requirements.Add(new PermissionRequirement(permission)));
                options.AddPolicy(PolicyTypes.Products.Add, policy => policy.Requirements.Add(new PermissionRequirement(Permissionss.Products.Add)));
                options.AddPolicy(PolicyTypes.Products.Delete, policy => policy.Requirements.Add(new PermissionRequirement(Permissionss.Products.Delete)));
                options.AddPolicy(PolicyTypes.Products.Edit, policy => policy.Requirements.Add(new PermissionRequirement(Permissionss.Products.Edit)));
                options.AddPolicy(PolicyTypes.Products.View, policy => policy.Requirements.Add(new PermissionRequirement(Permissionss.Products.View)));
                //}
            });

            #region Services
            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IPermissionService, PermissionService>();
            #endregion

            services.Configure<JWTSettings>(configuration.GetSection("JWTSettings"));
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(o =>
                {
                    o.RequireHttpsMetadata = false;
                    o.SaveToken = false;
                    o.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero,
                        ValidIssuer = configuration["JWTSettings:Issuer"],
                        ValidAudience = configuration["JWTSettings:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWTSettings:Key"]))
                    };
                    o.Events = new JwtBearerEvents()
                    {
                        
                        OnAuthenticationFailed = c =>
                        {
                            c.NoResult();
                            c.Response.StatusCode = 500;
                            c.Response.ContentType = "text/plain";
                            return c.Response.WriteAsync(c.Exception.ToString());
                        },
                        OnChallenge = context =>
                        {
                            context.HandleResponse();
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";
                            var result = JsonConvert.SerializeObject(new Response<string>("You are not Authorized"));
                            return context.Response.WriteAsync(result);
                        },
                        OnForbidden = context =>
                        {
                            context.Response.StatusCode = 403;
                            context.Response.ContentType = "application/json";
                            var result = JsonConvert.SerializeObject(new Response<string>("You are not authorized to access this resource"));
                            return context.Response.WriteAsync(result);
                        },
                    };
                });
        }
    }
}