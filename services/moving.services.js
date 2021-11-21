export class MovingService {
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
            url = `api/v1/moving?pageNumber=${options.page}&pageSize=${options.itemsPerPage}`;
        else
          url = `api/v1/moving?pageNumber=${options.page}&pageSize=${options.itemsPerPage}&sortBy=${options.sortBy[0]} ${options.sortDesc[0] ? "desc" : ""}`;
        
        return url
    }

    async view (options, filter) {
      if ($nuxt.$permissions.can('view', 'moving'))
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
            this.$toast.error("Ошибка во время загрузки перемещений.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на просмотр перемещений.");
      }
    }

    async update (item)
    {
      if ($nuxt.$permissions.can('edit', 'moving'))
      {
        let data;
        
        try
        {
            await this.$axios.post("api/v1/moving/update", item).then(response => {
                    data = response.data
                }
            );

            this.$toast.success("Перемещения успешно обновлено.");
            return data;
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время обновления перемещений.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на изменение перемещений.");
      }
    }

    async add (item)
    {
      if ($nuxt.$permissions.can('add', 'moving'))
      {
        let data;
        
        try
        {
            await this.$axios.post("api/v1/moving", item).then(response => {
                    data = response.data
                }
            );

            this.$toast.success("Перемещение успешно добавлено.");
            return data;
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время добавления перемещения.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на добавление перемещений.");
      }
    }
  }