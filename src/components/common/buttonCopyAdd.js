import { Button, Tooltip } from '@douyinfe/semi-ui'
import { IconCopyAdd } from '@douyinfe/semi-icons';

function ButtonOpenCard(props)
{
    return (
        <>
        <Tooltip content={"Создать копию"}>
            <Button icon={props.icon ? props.icon : <IconCopyAdd />} aria-label={'Создать копию'} theme={'borderless'} type={'tertiary'} onClick={(e) => props.onClick()} disabled={props.disabled ? props.disabled : false} />
        </Tooltip>
        </>
    )
}

export default ButtonOpenCard