import { Button } from '@douyinfe/semi-ui'
import { IconIdCard } from '@douyinfe/semi-icons';

function ButtonOpenCard(props)
{
    return (
        <>
            <Button icon={props.icon ? props.icon : <IconIdCard />} aria-label={'Карточка'} theme={'borderless'} type={'tertiary'} onClick={(e) => props.onClick(props.record)} disabled={props.disabled ? props.disabled : false} />
        </>
    )
}

export default ButtonOpenCard