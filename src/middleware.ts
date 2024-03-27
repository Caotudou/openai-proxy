import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API = 'https://api.openai.com'
export const config = {
    matcher: ['/openaiAPI/(.*)']
}
interface MySpecificObject {
    [key: string]: any
}
export default async function apiHandler(req: NextRequest) {
    // 自定义header中包含需要转向的host地址
    let hostUrl = OPENAI_API
    const headersObj: MySpecificObject = {}
    for (let [index, item] of req.headers.entries()) {
        headersObj[index] = item
    }
    // 对应的真实路由
    const pathname = req.nextUrl.pathname.replace('/openaiAPI', '')

    // // !!!注意：只有流式响应的headers不能携带，需要手动写入
    // if (!hostUrl && pathname === '/v1/chat/completions') {
    //   hostUrl = OPENAI_API
    // }
    if (req.method === 'POST') {
        // 获取POST请求体数据
        const requestPayload = await req.clone().json()
        // 发送POST请求到目标API
        const res = await fetch(`${hostUrl}${pathname}`,{
            method: 'POST',
            body: JSON.stringify(requestPayload),
            headers:headersObj
        })


        const data =await res.json()
        return NextResponse.json(data)
    } else if (req.method == 'GET') {
        const queryParams = req.nextUrl.searchParams
        let targetUrl = `${hostUrl}${pathname}?${queryParams.toString()}`
        return NextResponse.rewrite(targetUrl)
    }else{
        return NextResponse.next()
    }
}
