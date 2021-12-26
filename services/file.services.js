import FileSaver from 'file-saver'

export class FileService {
    constructor ($axios, $toast) {
      this.$axios = $axios
      this.$toast = $toast
    }
  
    async download (fileId)
    {
      if ($nuxt.$permissions.can('view', 'file'))
      {
        try
        {
          this.$toast.info("Начат экспорт файла.");
          await this.$axios.get(`/api/file/download/?fileId=${fileId}`, { responseType: 'blob' })
            .then(response => {
              const fl = new Blob([response.data], { type: response.data['type'] });
              FileSaver.saveAs(fl, "Документ");
              this.$toast.success("Файл экспортирован.");
            })
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время экспорта файла.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на просмотр файлов.");
      }
    }

    async upload (formData)
    {
      if ($nuxt.$permissions.can('add', 'file'))
      {
        let data;
        
        try
        {
            this.$toast.success("Загрузка файла...")
            
            await this.$axios.post('/api/file/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                data = response.data;
            });

            this.$toast.success("Файл успешно загружен.")

            return data;
        }
        catch (e)
        {
            this.$toast.error("Ошибка во время загрузки файла.");
        }
      }
      else
      {
        this.$toast.error("У вас нет прав на загрузку файлов.");
      }
    }
  }