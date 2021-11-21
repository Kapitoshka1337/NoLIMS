export class DepartmentService {
    constructor ($axios, $toast) {
      this.$axios = $axios
      this.$toast = $toast
    }
   
    computedFilter(filter)
    {
        let url = '';

        if (Object.keys(filter).length > 0)
        {
            Object.keys(filter).forEach(el => {
                if (filter[el] != null || filter[el] != "" || filter[el] > 0)
                    url += `&${el}=${filter[el]}`
            })
        }

        return url
    }

    computedUrl(options)
    {
        let url = ''

        if (options.sortBy.length <= 0)
            url = `api/v1/department?pageNumber=${options.page}&pageSize=${options.itemsPerPage}`;
        else
          url = `api/v1/department?pageNumber=${options.page}&pageSize=${options.itemsPerPage}&sortBy=${options.sortBy[0]} ${options.sortDesc[0] ? "desc" : ""}`;
        
        return url
    }

    async view (options, filter) {
      if ($nuxt.$permissions.can('view', 'department'))
      {
        let data;
        
        try
        {
            let url = this.computedUrl(options);
            let filterUrl = "";
            if (filter) filterUrl = this.computedFilter(filter);

            await this.$axios.get(url + filterUrl).then(response => {
                    data = response.data
                }
            );

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

    async update (item)
    {
      if ($nuxt.$permissions.can('edit', 'department'))
      {
        let data;
        
        try
        {
            await this.$axios.post("api/v1/department/update", item).then(response => {
                    data = response.data
                }
            );

            this.$toast.success("Подразделения успешно обновлено.");
            return data;
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время обновления подразделения.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на изменение подразделения.");
      }
    }
  }