using Application.Features.Verification.GetAllVerification;
using Domain.Entities.Equipment;
using Domain.Entities.Equipment.Verification;
using Domain.Entities.User;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Text;

namespace Infrastructure.Persistence.Extension
{
    public static class SortBy
    {
        private static DynamicExpressions.FilterOperator Operation(System.Type type, CustomAttributeData attribute)
        {
            if (type == typeof(string))
                return DynamicExpressions.FilterOperator.Contains;

            if (type == typeof(int))
                return DynamicExpressions.FilterOperator.Equals;

            if (type == typeof(DateTime?) && attribute.AttributeType.Name == "StartDate")
                return DynamicExpressions.FilterOperator.GreaterThanOrEqual;

            if (type == typeof(DateTime?) && attribute.AttributeType.Name == "EndDate")
                return DynamicExpressions.FilterOperator.LessThanOrEqual;

            return DynamicExpressions.FilterOperator.Equals;
        }

        public static IQueryable<Equipment> FilterEquipment(this IQueryable<Equipment> owners, Application.Features.Equipment.Queries.GetAllEquipment.GetAllEquipmentParameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            IQueryable<Equipment> result = owners;

            if (!string.IsNullOrEmpty(request.Name))
            {
                result = result.Where(x =>
                x.Name.ToLower().Contains(request.Name.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.Number))
            {
                result = result.Where(x => x.Number.ToLower().Contains(request.Number.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.Model))
            {
                result = result.Where(x => x.Model.ToLower().Contains(request.Model.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.SerialNumber))
            {
                result = result.Where(x => x.SerialNumber.ToLower().Contains(request.SerialNumber.ToLower()));
            }
            
            if (!string.IsNullOrEmpty(request.InventoryNumber))
            {
                result = result.Where(x => x.InventoryNumber.ToLower().Contains(request.InventoryNumber.ToLower()));
            }

            if (request.DepartmentId.HasValue)
            {
                result = result.Where(x => x.DepartmentId.Equals(request.DepartmentId));
            }

            if (request.TypeId.HasValue)
            {
                result = result.Where(x => x.TypeId.Equals(request.TypeId));
            }

            if (request.TagId.HasValue)
            {
                result = result.Where(x => x.TagId.Equals(request.TagId));
            }

            if (request.ManufacturerId.HasValue)
            {
                result = result.Where(x => x.ManufacturerId.Equals(request.ManufacturerId));
            }

            if (request.DateCreate != null)
            {
                result = result.Where(x => x.DateCreate.Value == request.DateCreate);
            }
            
            if (request.DateCommissioning != null)
            {
                result = result.Where(x => x.DateCommissioning.Value == request.DateCommissioning);
            }

            if (!string.IsNullOrEmpty(request.FifNumber))
            {
                result = result.Where(x => x.FifNumber.ToLower().Contains(request.FifNumber.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.Accuracy))
            {
                result = result.Where(x => x.Accuracy.ToLower().Contains(request.Accuracy.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.ClassAccuracy))
            {
                result = result.Where(x => x.ClassAccuracy.ToLower().Contains(request.ClassAccuracy.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.MeasuringRange))
            {
                result = result.Where(x => x.MeasuringRange.ToLower().Contains(request.MeasuringRange.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.MeasuringWork))
            {
                result = result.Where(x => x.MeasuringWork.ToLower().Contains(request.MeasuringWork.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.Characteristics))
            {
                result = result.Where(x => x.Characteristics.ToLower().Contains(request.Characteristics.ToLower()));
            }

            return result;
        }

        public static IQueryable<ApplicationUser> FilterUser(this IQueryable<ApplicationUser> owners, Application.Features.User.GetAll.Parameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            IQueryable<ApplicationUser> result = owners;

            if (!string.IsNullOrEmpty(request.FirstName))
            {
                result = result.Where(x => x.FirstName.ToLower().Contains(request.FirstName.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.MiddleName))
            {
                result = result.Where(x => x.MiddleName.ToLower().Contains(request.MiddleName.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                result = result.Where(x => x.LastName.ToLower().Contains(request.LastName.ToLower()));
            }

            if (request.DepartmentId > 0)
            {
                result = result.Where(x => x.DepartmentId.Equals(request.DepartmentId));
            }

            return result;
        }

        public static IQueryable<Instruction> FilterInstruction(this IQueryable<Instruction> owners, Application.Features.Instruction.GetAll.Parameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            IQueryable<Instruction> result = owners;

            if (!string.IsNullOrEmpty(request.Name))
            {
                result = result.Where(x => x.Name.ToLower().Contains(request.Name.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.Number))
            {
                result = result.Where(x => x.Number.ToLower().Contains(request.Number.ToLower()));
            }

            return result;
        }

        public static IQueryable<Verification> FilterVerification(this IQueryable<Verification> owners, GetAllVerificationParameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            IQueryable<Verification> result = owners;

            if (!string.IsNullOrEmpty(request.EquipmentName))
            {
                result = result.Where(x => x.Equipment.Name.ToLower().Contains(request.EquipmentName.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.EquipmentModel))
            {
                result = result.Where(x => x.Equipment.Model.ToLower().Contains(request.EquipmentModel.ToLower()));
            }

            if (!string.IsNullOrEmpty(request.EquipmentSerialNumber))
            {
                result = result.Where(x => x.Equipment.SerialNumber.ToLower().Contains(request.EquipmentSerialNumber.ToLower()));
            }

            if (request.DepartmentId > 0)
            {
                result = result.Where(x => x.Equipment.DepartmentId.Equals(request.DepartmentId));
            }

            if (request.StatusId > 0)
            {
                result = result.Where(x => x.StatusId.Equals(request.StatusId));
            }

            return result;
        }

        public static IQueryable<Check> FilterChecks(this IQueryable<Check> owners, Application.Features.Check.GetAll.Parameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            IQueryable<Check> result = owners;

            if (request.CurrentCheckStart != null)
            {
                result = result.Where(x => x.CurrentCheck.Value >=  request.CurrentCheckStart);
            }

            if (request.CurrentCheckEnd != null)
            {
                result = result.Where(x => x.CurrentCheck.Value <= request.CurrentCheckEnd);
            }

            if (request.NextCheckStart != null)
            {
                result = result.Where(x => x.NextCheck.Value >= request.NextCheckStart);
            }

            if (request.NextCheckEnd != null)
            {
                result = result.Where(x => x.NextCheck.Value <= request.NextCheckEnd);
            }

            if (request.EquipmentId > 0)
            {
                result = result.Where(x => x.EquipmentId.Equals(request.EquipmentId));
            }

            if (request.DocumentKindId > 0)
            {
                result = result.Where(x => x.DocumentKindId.Value.Equals(request.DocumentKindId));
            }
            
            if (!string.IsNullOrEmpty(request.NumberDocument))
            {
                result = result.Where(x => x.NumberDocument.ToLower().Contains(request.NumberDocument.ToLower()));
            }

            return result;
        }

        public static IQueryable<T> Filter<T, TParameter>(this IQueryable<T> owners, TParameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            var requestProperty = typeof(TParameter).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var objectProperty = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            DynamicExpressions.DynamicFilterBuilder<T> expr = null;

            foreach (var reqProperty in requestProperty)
            {
                var propValue = reqProperty.GetValue(request, null);

                if (propValue == null)
                    continue;

                foreach (var objProperty in objectProperty)
                {
                    if (Equals(objProperty.Name, reqProperty.Name))
                    {
                        if (expr == null)
                            expr = new DynamicExpressions.DynamicFilterBuilder<T>();

                        var operation = Operation(reqProperty.PropertyType, reqProperty.CustomAttributes.FirstOrDefault());

                        expr.And(reqProperty.Name, operation, propValue);
                    }
                }
            }

            if (expr != null)
            {
                var buildedExpr = expr.Build();
                return owners.Where(buildedExpr);
            }

            return owners;
        }

        public static IQueryable<T> Sort<T>(this IQueryable<T> owners, string orderByQueryString) where T : class
        {
            if (!owners.Any())
                return owners;

            if (string.IsNullOrWhiteSpace(orderByQueryString))
            {
                return owners;
            }

            var orderParams = orderByQueryString.Trim().Split('.');
            var orderQueryBuilder = new StringBuilder();
            var propertyInfos = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            if (orderParams.Length > 1)
            {
                var sortingOrder = orderByQueryString.EndsWith(" desc") ? "descending" : "ascending";

                var objectProperty = propertyInfos.FirstOrDefault(pi => pi.Name.Equals(orderParams[0], StringComparison.InvariantCultureIgnoreCase));

                if (objectProperty == null)
                    return owners;

                var info = objectProperty.PropertyType;
                var types = info.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                var typesName = types.FirstOrDefault(pi => pi.Name.Equals(orderParams[1].Split(" ")[0], StringComparison.InvariantCultureIgnoreCase));

                if (typesName == null)
                    return owners;

                orderQueryBuilder.Append($"{objectProperty.Name}.{typesName.Name} {sortingOrder}, ");

                owners = owners.OrderBy(orderQueryBuilder.ToString().TrimEnd(',', ' '));

                return owners;
            }

            foreach (var param in orderParams)
            {
                if (string.IsNullOrWhiteSpace(param))
                    continue;

                var sortingOrder = param.EndsWith(" desc") ? "descending" : "ascending";

                var propertyFromQueryName = param.Split(" ")[0];
                var objectProperty = propertyInfos.FirstOrDefault(pi => pi.Name.Equals(propertyFromQueryName, StringComparison.InvariantCultureIgnoreCase));

                if (objectProperty == null)
                    continue;

                var info = objectProperty.PropertyType;
                var types = info.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                var typesName = types.FirstOrDefault(pi => pi.Name.Equals("Name", StringComparison.InvariantCultureIgnoreCase));

                if (typesName != null)
                {
                    orderQueryBuilder.Append($"{objectProperty.Name}.{typesName.Name} {sortingOrder}, ");
                }
                else
                {
                    orderQueryBuilder.Append($"{objectProperty.Name} {sortingOrder}, ");
                }
            }

            var orderQuery = orderQueryBuilder.ToString().TrimEnd(',', ' ');

            if (string.IsNullOrWhiteSpace(orderQuery))
            {
                return owners;
            }

            owners = owners.OrderBy(orderQuery);

            return owners;
        }
    }
}
