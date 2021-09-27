using Application.Filters;

namespace Application.Features.Instruction.GetAll
{
    public class Parameter : RequestParameter 
    {
        public string Name { get; set; }
        public string Number { get; set; }
    }
}
