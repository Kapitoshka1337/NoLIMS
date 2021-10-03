namespace Application.Features.Role.Update
{
    public class UpdateInput
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public string Resources { get; set; }
        public bool IsGranted { get; set; }
    }
}
