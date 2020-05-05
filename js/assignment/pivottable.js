axios.get("/assignment/get-report?num=2")
            .then(function (response)
                {
                    if (response.data) 
                        {
                            var pivot = new WebDataRocks({
                                container: "#wdr-component",
                                beforetoolbarcreated: customizeToolbar,
                                toolbar: true,
                                height: 800,
                                report: {
                                    dataSource: {
                                        data: response.data
                                    },
                                    slice: {
                                        rows: [
                                            {uniqueName: "ветстанция"},
                                            {uniqueName: "район"},
                                            {uniqueName: "животное"}
                                        ],
                                        columns: [{
                                            uniqueName: "исследование"
                                        }],
                                        measures: [
                                            {
                                                uniqueName: "количество",
                                                aggregation: "sum"
                                            },
                                            {
                                                uniqueName: "план_квартальный - количество",
                                                formula: "none(\"план_квартальный\") - sum(\"количество\") ",
                                                caption: "ПРЕВЫШЕНИЕ"
                                            },
                                            {
                                                uniqueName: "план_квартальный",
                                                formula: "none(\"план_квартальный\")",
                                                caption: "ПЛАН_КВАРТ"
                                            }
                                        ],
                                    },
                                    conditions: [
                                            {
                                                formula: "#value <= 0",
                                                measure: "план_квартальный - количество",
                                                format:
                                                {
                                                    backgroundColor: "#F44336",
                                                    color: "#FFFFFF",
                                                    fontFamily: "Arial",
                                                    fontSize: "12px"
                                                },
                                            }
                                        ],
                                    localization: "/frontend/web/wdr.json"
                                },
                            });
			    pivot.on('dataloaded', function(){alert('Отчет загружен');});
                            function customizeToolbar(toolbar)
                            {
                                let tabs = toolbar.getTabs();
                                toolbar.getTabs = function()
                                {
                                    delete tabs[0];
                                    delete tabs[1];
                                    delete tabs[2];
                                    delete tabs[4];
                                    delete tabs[7];
                                    return tabs;
                                }
                                let updateData = function()
                                {
                                    $.ajax(
                                    {
                                        type: "GET",
                                        url: "/assignment/get-report?num=3",
                                        success: function(msg)
                                        {
                                            pivot.updateData({data: msg});
                                        }
                                    });
                                };
                            };
                            let menu = new Vue({
                                el: "#menu",
                                methods:{
                                    getGreater(){
                                        axios.get('/assignment/get-report?num=3').then(function(response) {
                                            pivot.updateData({data: response.data})
                                        })
                                    },
                                    getGeneral(){
                                        axios.get('/assignment/get-report?num=2').then(function(response) {
                                            pivot.updateData({data: response.data})
                                        })
                                    }
                                }
                            });
                        }
                });