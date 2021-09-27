namespace Application.DTOs.Equipment
{
    public class EquipmentIO : Equipment
    {
        // ИО Точность.
        public string Accuracy { get; set; }
        // ИО Диапазон работы.
        public string MeasuringWork { get; set; }
    }
}
