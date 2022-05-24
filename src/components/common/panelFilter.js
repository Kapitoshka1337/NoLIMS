import { SideSheet, Row, Col, Input } from '@douyinfe/semi-ui'

const onChangeName = (value, column, filters) => {
    let filter = filters;
    filter[column] = value;

    return filter;
}

function PanelFilter(props)
{
    return (
        <>
            <SideSheet getPopupContainer={null} disableScroll={false} title="Панель фильтрации" mask={true} visible={props.show} onCancel={() => props.onCancel(false)} size={"small"}>
                <Row>
                    {
                        props.columns.map((column) => {
                            if (column.dataIndex != 'actions')
                                if (column.inFilter)
                                    return (
                                            <Col key={column.dataIndex}>
                                                <Input type={column.type} placeholder={column.title} value={props.filters[column.dataIndex]} onChange={(value, event) => props.onChange(onChangeName(value, column.dataIndex, props.filters))}/>
                                            </Col>
                                    )
                        })
                    }
                </Row>
            </SideSheet>
        </>
    )
}

export default PanelFilter