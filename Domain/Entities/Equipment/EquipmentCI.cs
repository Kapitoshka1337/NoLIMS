namespace Domain.Entities.Equipment
{
    public class EquipmentCI : Equipment
    {
        // СИ ФИФ.
        public string FifNumber { get; set; }
        // СИ Точность.
        public string Accuracy { get; set; }
        // СИ Класс точности.
        public string ClassAccuracy { get; set; }
        // СИ Диапазон измерений.
        public string MeasuringRange { get; set; }
    }
}
