import { dauth, sleep } from "../utils";
import { useCounter, useRequest } from 'ahooks'
const Dev = () => {
    const [success, { inc: incSuc }] = useCounter(0);
    const [fail, { inc: incFail }] = useCounter(0);
    const authEmailOtp = async () => {
        await dauth.service.sendOtp({
            account: 'scott@dauth.network',
            id_type: 'mailto',
            request_id: 'test'
        })
    }

    const authOtpConfirm = async () => {
        await dauth.service.authOtpConfirm({
            code: "123456",
            request_id: 'test',
            mode: 'jwt',
            id_type: 'mailto'
        })
    }
    const task = async () => {
        try {
            await authEmailOtp()
            await sleep(200)
            await authOtpConfirm()
            incSuc()
        } catch (error) {
            incFail()

        }
    }
    const { run, cancel } = useRequest(task, {
        manual: true,
        pollingInterval: 1000,

    });

    return (
        <div className="">
            <button onClick={run}>Start</button>
            <button onClick={cancel}>Stop</button>
            <div>
                成功: {success} 次<br />
                失败: {fail} 次<br />
            </div>
        </div>
    )
}

export default Dev