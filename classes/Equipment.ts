class CEquipment implements IEquipment
{
    public dateCommissioning!: Date;
    public dateCreate!: Date;
    public departmentId: number = 1;
    public description!: string;
    public id!: number;
    public instructionId!: number;
    public inventoryNumber: string = "";
    public locationId!: number;
    public manufacturerId!: number;
    public model: string = "";
    public name: string = "";
    public number: string = "";
    public purposeOfUse!: string;
    public serialNumber: string = "";
    public typeId: number = 1;

    constructor ()
    {
        
    }
}