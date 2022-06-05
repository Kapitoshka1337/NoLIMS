import { SideSheet, Row, Col, Input, DatePicker, Button } from '@douyinfe/semi-ui'

const onChangeName = (value, column, filters) => {
    let filter = filters;
    filter[column] = value;

    return filter;
}

const onResetFilter = () => {
    return {};
}

function PanelFilter(props)
{
    return (
        <>
            <SideSheet
            getPopupContainer={null}
            disableScroll={false}
            title="Панель фильтрации"
            mask={true}
            visible={props.show}
            onCancel={() => props.onCancel(false)}
            size={"small"}
            footer={
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => props.onChange(onResetFilter())}>Сбросить</Button>
                    </div>
                </>
            }
            >
                <Row>
                    {
                        props.columns.map((column) => {
                            if (column.dataIndex != 'actions')
                                if (column.inFilter)
                                {
                                    if (column.type == 'date')
                                    {
                                        return (
                                            <Col key={column.dataIndex || column.filterIndex}>
                                                <DatePicker style={{ width: '100%' }} placeholder={column.title} onChange={(date, dateString) => props.onChange(onChangeName(dateString, column.filterIndex, props.filters))} value={props.filters[column.filterIndex]}/>
                                            </Col>
                                        )
                                    }
                                    else if (column.renderFilter)
                                    {
                                        return column.renderFilter()
                                    }
                                    else
                                    {
                                        return (
                                            <Col key={column.dataIndex || column.filterIndex}>
                                                <Input type={column.type} placeholder={column.title} value={props.filters[column.filterIndex]} onChange={(value, event) => props.onChange(onChangeName(value, column.filterIndex, props.filters))}/>
                                            </Col>
                                        )
                                    }
                                }
                        })
                    }
                </Row>
            </SideSheet>
        </>
    )
}

export default PanelFilter