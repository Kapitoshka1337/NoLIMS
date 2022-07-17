import { Button, Tooltip } from '@douyinfe/semi-ui'
import { IconIdCard } from '@douyinfe/semi-icons';

function ButtonOpenCard(props)
{
    return (
        <>
        <Tooltip content={props.content ? props.content : "Открыть карточку"}>
            <Button icon={props.icon ? props.icon : <IconIdCard />} aria-label={'Карточка'} theme={'borderless'} type={'tertiary'} onClick={(e) => props.onClick(props.record)} disabled={props.disabled ? props.disabled : false} />
        </Tooltip>
        </>
    )
}

export default ButtonOpenCard