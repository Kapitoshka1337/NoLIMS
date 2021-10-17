namespace Application.Features.UserRole.Update
{
    public class UpdateInput
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public string Resources { get; set; }
        public bool IsGranted { get; set; }
    }
}
