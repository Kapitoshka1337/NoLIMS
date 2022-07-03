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

            DynamicExpressions.DynamicFilterBuilder<Equipment> expr = null;

            if (!string.IsNullOrEmpty(request.Name))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("Name", DynamicExpressions.FilterOperator.Contains, request.Name);
            }

            if (!string.IsNullOrEmpty(request.Number))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("Number", DynamicExpressions.FilterOperator.Contains, request.Number);
            }

            if (!string.IsNullOrEmpty(request.Model))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("Model", DynamicExpressions.FilterOperator.Contains, request.Model);
            }

            if (!string.IsNullOrEmpty(request.SerialNumber))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("SerialNumber", DynamicExpressions.FilterOperator.Contains, request.SerialNumber);
            }

            if (request.DepartmentId.HasValue)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("DepartmentId", DynamicExpressions.FilterOperator.Equals, request.DepartmentId.Value);
            }

            if (request.TypeId.HasValue)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("TypeId", DynamicExpressions.FilterOperator.Equals, request.TypeId.Value);
            }

            if (request.TagId.HasValue)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Equipment>();

                expr.And("TagId.Value", DynamicExpressions.FilterOperator.Equals, request.TagId.Value);
            }

            if (expr != null)
            {
                var buildedExpr = expr.Build();
                return owners.Where(buildedExpr);
            }

            return owners;
        }

        public static IQueryable<ApplicationUser> FilterUser(this IQueryable<ApplicationUser> owners, Application.Features.User.GetAll.Parameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            DynamicExpressions.DynamicFilterBuilder<ApplicationUser> expr = null;

            if (!string.IsNullOrEmpty(request.FirstName))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<ApplicationUser>();

                expr.And("FirstName", DynamicExpressions.FilterOperator.Contains, request.FirstName);
            }

            if (!string.IsNullOrEmpty(request.MiddleName))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<ApplicationUser>();

                expr.And("MiddleName", DynamicExpressions.FilterOperator.Contains, request.MiddleName);
            }

            if (!string.IsNullOrEmpty(request.LastName))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<ApplicationUser>();

                expr.And("LastName", DynamicExpressions.FilterOperator.Contains, request.LastName);
            }

            if (request.DepartmentId > 0)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<ApplicationUser>();

                expr.And("DepartmentId", DynamicExpressions.FilterOperator.Equals, request.DepartmentId);
            }

            if (expr != null)
            {
                var buildedExpr = expr.Build();
                return owners.Where(buildedExpr);
            }

            return owners;
        }

        public static IQueryable<Instruction> FilterInstruction(this IQueryable<Instruction> owners, Application.Features.Instruction.GetAll.Parameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            DynamicExpressions.DynamicFilterBuilder<Instruction> expr = null;

            if (!string.IsNullOrEmpty(request.Name))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Instruction>();

                expr.And("Name", DynamicExpressions.FilterOperator.Contains, request.Name);
            }

            if (!string.IsNullOrEmpty(request.Number))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Instruction>();

                expr.And("Number", DynamicExpressions.FilterOperator.Contains, request.Number);
            }


            if (expr != null)
            {
                var buildedExpr = expr.Build();
                return owners.Where(buildedExpr);
            }

            return owners;
        }

        public static IQueryable<Verification> FilterVerification(this IQueryable<Verification> owners, GetAllVerificationParameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            DynamicExpressions.DynamicFilterBuilder<Verification> expr = null;

            if (!string.IsNullOrEmpty(request.EquipmentName))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Verification>();

                expr.And("Equipment.Name", DynamicExpressions.FilterOperator.Contains, request.EquipmentName);
            }

            if (!string.IsNullOrEmpty(request.EquipmentModel))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Verification>();

                expr.And("Equipment.Model", DynamicExpressions.FilterOperator.Contains, request.EquipmentModel);
            }

            if (!string.IsNullOrEmpty(request.EquipmentSerialNumber))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Verification>();

                expr.And("Equipment.SerialNumber", DynamicExpressions.FilterOperator.Contains, request.EquipmentSerialNumber);
            }

            if (request.DepartmentId > 0)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Verification>();

                expr.And("Equipment.Department.Id", DynamicExpressions.FilterOperator.Equals, request.DepartmentId);
            }

            if (request.StatusId > 0)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Verification>();

                expr.And("StatusId", DynamicExpressions.FilterOperator.Equals, request.StatusId);
            }

            if (expr != null)
            {
                var buildedExpr = expr.Build();
                return owners.Where(buildedExpr);
            }

            return owners;
        }

        public static IQueryable<Check> FilterChecks(this IQueryable<Check> owners, Application.Features.Check.GetAll.Parameter request)
        {
            if (!owners.Any())
                return owners;

            if (request == null)
                return owners;

            DynamicExpressions.DynamicFilterBuilder<Check> expr = null;

            if (request.CurrentCheckStart != null)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("CurrentCheck.Value", DynamicExpressions.FilterOperator.GreaterThanOrEqual, request.CurrentCheckStart);
            }

            if (request.CurrentCheckEnd != null)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("CurrentCheck.Value", DynamicExpressions.FilterOperator.LessThanOrEqual, request.CurrentCheckEnd);
            }

            if (request.NextCheckStart != null)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("NextCheck.Value", DynamicExpressions.FilterOperator.GreaterThanOrEqual, request.NextCheckStart);
            }

            if (request.NextCheckEnd != null)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("NextCheck.Value", DynamicExpressions.FilterOperator.LessThanOrEqual, request.NextCheckEnd);
            }

            if (request.EquipmentId > 0)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("EquipmentId", DynamicExpressions.FilterOperator.Equals, request.EquipmentId);
            }

            if (request.DocumentKindId > 0)
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("DocumentKindId.Value", DynamicExpressions.FilterOperator.Equals, request.DocumentKindId);
            }
            
            if (!string.IsNullOrEmpty(request.NumberDocument))
            {
                if (expr == null)
                    expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

                expr.And("NumberDocument", DynamicExpressions.FilterOperator.Contains, request.NumberDocument);
            }

            //if (request.DepartmentId != null)
            //{
            //    if (expr == null)
            //        expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

            //    expr.And("Equipment.DepartmentId", DynamicExpressions.FilterOperator.Equals, request.DepartmentId);
            //}

            //if (request.TypeId != null)
            //{
            //    if (expr == null)
            //        expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

            //    expr.And("Equipment.TypeId", DynamicExpressions.FilterOperator.Equals, request.TypeId);
            //}

            //if (!string.IsNullOrEmpty(request.EquipmentName))
            //{
            //    if (expr == null)
            //        expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

            //    expr.And("Equipment.Name", DynamicExpressions.FilterOperator.Contains, request.EquipmentName);
            //}

            //if (!string.IsNullOrEmpty(request.EquipmentModel))
            //{
            //    if (expr == null)
            //        expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

            //    expr.And("Equipment.Model", DynamicExpressions.FilterOperator.Contains, request.EquipmentModel);
            //}

            //if (!string.IsNullOrEmpty(request.EquipmentSerialNumber))
            //{
            //    if (expr == null)
            //        expr = new DynamicExpressions.DynamicFilterBuilder<Check>();

            //    expr.And("Equipment.SerialNumber", DynamicExpressions.FilterOperator.Contains, request.EquipmentSerialNumber);
            //}

            if (expr != null)
            {
                var buildedExpr = expr.Build();
                return owners.Where(buildedExpr);
            }

            return owners;
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
