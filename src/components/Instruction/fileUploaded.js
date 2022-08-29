import { Button, Upload } from '@douyinfe/semi-ui'
import { IconUpload } from '@douyinfe/semi-icons';
import agent from '../../agent';

function FileUploaded(props)
{
    // if (props.fileId)
        return (
            <>
                <Upload action={`${agent.API_ROOT}/file/upload`} fileList={props.fileList} renderFileOperation={props.onRender}>
                    <Button disabled={props.fileId ? true : false} icon={<IconUpload />} theme="light">
                        Загрузите файл пройденной поверки
                    </Button>
                </Upload>
            </>
        )
    // else
    //     return (
    //         <>
    //             <Upload afterUpload={(e) => this.handleAfterUpload(e.response.data)} action={`${agent.API_ROOT}/file/upload`} headers={{'authorization': `Bearer ${props.token}`}}>
    //                 <Button icon={<IconUpload />} theme="light">
    //                     Загрузите файл пройденной поверки
    //                 </Button>
    //             </Upload>
    //         </>
    //     )
}

export default FileUploaded