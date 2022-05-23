import { SideSheet, Checkbox } from '@douyinfe/semi-ui'

function PanelAppearance(props)
{
    return (
        <>
            <SideSheet getPopupContainer={null} disableScroll={false} title="Настройка внешнего вида" mask={true} visible={props.show} onCancel={() => props.onCancel(false)} size={"small"}>
            {props.columns.map((column) => {
                if (column.dataIndex != 'actions')
                    return (
                        <Checkbox key={column.dataIndex} checked={column.visible} onChange={checked => props.onChangeVisibleColumn(checked)} aria-label={column.dataIndex}>
                            {column.title}
                        </Checkbox>
                    )
            })}
            </SideSheet>
        </>
    )
}

export default PanelAppearance