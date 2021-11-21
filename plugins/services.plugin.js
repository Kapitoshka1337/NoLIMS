import { DepartmentService } from '../services/department.services'
import { PermissionService } from '../services/permission.services'
import { EmployesService } from '../services/employes.service'
import { EquipmentService } from '../services/equipment.services'
import { ChecksService } from '../services/checks.services'
import { VerificationsService } from '../services/verifications.services'
import { InstructionsService } from '../services/instructions.services'
import { RolesService } from '../services/roles.services'
import { LocationService } from '../services/location.services'
import { MovingService } from '../services/moving.services'

export default ({ app: { $axios, $toast, store } }, inject) => {
  const Department = new DepartmentService($axios, $toast)
  const Permission = new PermissionService(store)
  const Employes = new EmployesService($axios, $toast)
  const Equipment = new EquipmentService($axios, $toast)
  const Checks = new ChecksService($axios, $toast)
  const Verifications = new VerificationsService($axios, $toast)
  const Instructions = new InstructionsService($axios, $toast)
  const Roles = new RolesService($axios, $toast)
  const Location = new LocationService($axios, $toast)
  const Moving = new MovingService($axios, $toast)
  
  inject('department', Department)
  inject('permissions', Permission)
  inject('employes', Employes)
  inject('equipment', Equipment)
  inject('checks', Checks)
  inject('verifications', Verifications)
  inject('instructions', Instructions)
  inject('roles', Roles)
  inject('locations', Location)
  inject('movings', Moving)
}