export class DepartmentService {
    constructor ($axios, $toast) {
      this.$axios = $axios
      this.$toast = $toast
    }
   
    async view (options, filter) {
      if ($nuxt.$permissions.can('view', 'department'))
      {
        let data;
        
        try
        {
            let url = "";

            if (options.sortBy.length <= 0)
                url = `api/v1/department?pageNumber=${options.page}&pageSize=${options.itemsPerPage}`;
            else
                url = `api/v1/department?pageNumber=${options.page}&pageSize=${options.itemsPerPage}&sortBy=${options.sortBy[0]} ${options.sortDesc[0] ? "desc" : ""}`;

            await this.$axios.get(url).then(response => {
                    data = response.data
                }
            );

            this.$toast.success("Подразделения успешно загружены.");
            return data;
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки подразделений.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на просмотр подразделений.");
      }
    }
  }