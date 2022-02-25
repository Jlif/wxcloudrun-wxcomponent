import {Button, Table, Tabs, Dialog, Input, Form, MessagePlugin, Popup, PopConfirm} from 'tdesign-react'
import {useEffect, useMemo, useRef, useState} from "react";
import {PrimaryTableCol} from "tdesign-react/es/table/type";
import {request} from "../../utils/axios";
import {getCallbackRuleRequest, deleteCallbackRuleRequest, addCallbackRuleRequest, updateCallbackRuleRequest} from "../../utils/apis";
import moment from "moment";

const {TabPanel} = Tabs
const {FormItem} = Form

const tabs = [{
    label: '授权事件',
    value: 'auth'
}, {
    label: '普通消息与事件',
    value: 'normal'
}]

const authMessageExample = <p>{`{`}
    <br/>"AppId": "wx6666666666666",
    <br/> "CreateTime": 1645169269,
    <br/> "InfoType": "component_verify_ticket",
    <br/> "ComponentVerifyTicket": "ticket@@@7soh4DQnhit53D5pIs8o5A4QXEBpZ1C7soh4DQnhi"
    <br/> {`}`}
</p>

const normalMessageExample = <p>{`{`}
    <br/>"ToUserName":"gh_e3dc25c7ce84",
    <br/>"FromUserName":"ohWOKlbtxDs7ZGIjjt-5Q",
    <br/>"CreateTime":1644982569,
    <br/>"MsgType":"event",
    <br/>"Event":"wxa_privacy_apply",
    <br/>"result_info":{`{`}<pre style={{ margin: 0 }}>   "api_name":"wx.choosePoi",
        <br/>   "apply_time":"1644975588",
        <br/>   "audit_id":"4211202267",
        <br/>   "audit_time":"1644982569",
        <br/>   "reason":"小程序内未含有相应使用场景",
        <br/>   "status":"2"
        <br/>   {`}`}
    </pre>{`}`}
</p>

const type1 = (row: Record<string, any>) => {
    return (
        <div>
            <div className="normal_flex">
                <p style={{ width: '100px' }}>转发端口</p>
                <p className="desc">{row.data.port}</p>
            </div>
            <div className="normal_flex">
                <p style={{ width: '100px' }}>目标路径</p>
                <p className="desc">{row.data.path}</p>
            </div>
        </div>
    )
}

export default function ForwardMessage() {

    const authMessageColumn: PrimaryTableCol[] = [{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'name',
        title: '规则名称',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'infoType',
        title: 'InfoType',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'updateTime',
        title: '最新修改时间',
        render: ({ row }) => moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        title: '操作',
        render({row, rowIndex}) {
            return (
                <div>
                    <a className="a" style={{ marginRight: '15px' }}>测试</a>
                    {/*<a className="a" style={{margin: '0 15px'}}>修改</a>*/}
                    <PopConfirm content={'确定删除吗'} onConfirm={() => handleDeleteRule(rowIndex)}>
                        <a className="a">删除</a>
                    </PopConfirm>
                </div>
            );
        },
    }]

    const normalMessageColumn: PrimaryTableCol[] = [{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'name',
        title: '规则名称',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'msgType',
        title: 'MsgType',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'event',
        title: 'Event',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'port',
        title: '端口',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'path',
        title: '目标路径',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'updateTime',
        title: '最新修改时间',
        render: ({ row }) => moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        title: '操作',
        render({row, rowIndex}) {
            return (
                <div>
                    <a className="a" style={{ marginRight: '15px' }}>测试</a>
                    {/*<a className="a" style={{margin: '0 15px'}}>修改</a>*/}
                    <PopConfirm content={'确定删除吗'} onConfirm={() => handleDeleteRule(rowIndex)}>
                        <a className="a">删除</a>
                    </PopConfirm>
                </div>
            );
        },
    }]

    const formRef = useRef() as any

    const [showRuleModal, setShowRuleModal] = useState<boolean>(false)
    const [selectedTab, setSelectedTab] = useState<string | number>(tabs[0].value)
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false)

    const [authData, setAuthData] = useState<any[]>([])
    const [normalData, setNormalData] = useState<any[]>([])

    useEffect(() => {
        getTableData()
    }, [selectedTab])

    const isAuthTab = useMemo(() => {
        return selectedTab === tabs[0].value
    }, [selectedTab])

    const getTableData = async () => {
        setIsTableLoading(true)
        switch (selectedTab) {
            case tabs[0].value: {
                const resp = await request({
                    request: getCallbackRuleRequest,
                    data: {
                        type: 1,
                        offset: 0,
                        limit: 999
                    }
                })
                if (resp.code === 0) {
                    setAuthData(resp.data.rules)
                }
                break
            }
            case tabs[1].value: {
                const resp = await request({
                    request: getCallbackRuleRequest,
                    data: {
                        type: 2,
                        offset: 0,
                        limit: 999
                    }
                })
                if (resp.code === 0) {
                    setNormalData(resp.data.rules)
                }
                break
            }
        }
        setIsTableLoading(false)
    }

    const handleCreateRule = async (e: any) => {
        console.log(e.validateResult)
        if (e.validateResult !== true) {
            return
        }
        // const data = formRef.current.getAllFieldsValue()
        // const resp = await request({
        //     request: addCallbackRuleRequest,
        //     data: {
        //         ...data,
        //         data: {
        //             open: true,
        //             port: +data.port,
        //             path: data.path
        //         }
        //     }
        // }, (code) => {
        //     if (code === 1001) {
        //         MessagePlugin.error('该事件已存在转发规则')
        //     }
        // })
        // if (resp.code === 0) {
        //     MessagePlugin.success('消息转发规则添加成功')
        //     handleCloseCreateModal()
        //     getTableData()
        // }
    }

    const handleCloseCreateModal = () => {
        formRef.current.reset()
        setShowRuleModal(false)
    }

    const handleDeleteRule = async (index: number) => {
        const resp = await request({
            request: deleteCallbackRuleRequest,
            data: {
                id: isAuthTab ? +authData[index].id : +normalData[index].id
            }
        })
        if (resp.code === 0) {
            MessagePlugin.success('删除成功')
            getTableData()
        }
    }

    return (
        <div>
            <p className="text">消息转发器介绍</p>
            <div className="normal_flex">
                <div className="blue_circle" />
                <p className="desc"
                   style={{margin: 0}}>微管家支持接收来自微信官方推送的消息转发给内部业务服务，通过添加转发规则可将不同场景的消息转发至后端服务，便于与业务进行更好的集成。</p>
            </div>
            <div className="normal_flex">
                <div className="blue_circle" />
                <p className="desc">微信官方消息会推送至第三方平台的“授权事件配置”以及“消息与事件配置”，可分别配置转发规则实现消息转发到后端服务，<a
                    href="https://open.weixin.qq.com/" target="_blank" className="a">查看文档</a></p>
            </div>
            <Tabs value={selectedTab} placement={'top'} size="medium" theme="normal" onChange={val => setSelectedTab(val)}>
                <TabPanel value={tabs[0].value} label={tabs[0].label}>
                    <div className="normal_flex" style={{margin: '10px 0'}}>
                        <Button style={{marginTop: '10px'}} onClick={() => setShowRuleModal(true)}>添加规则</Button>
                    </div>
                    <Table
                        loading={isTableLoading}
                        data={authData}
                        columns={authMessageColumn}
                        rowKey="id"
                        tableLayout="auto"
                        verticalAlign="middle"
                        size="small"
                        hover
                        expandedRow={({ row }) => type1(row)}
                    />
                </TabPanel>
                <TabPanel value={tabs[1].value} label={tabs[1].label}>
                    <div className="normal_flex" style={{margin: '10px 0'}}>
                        <Button style={{marginTop: '10px'}} onClick={() => setShowRuleModal(true)}>添加规则</Button>
                    </div>
                    <Table
                        loading={isTableLoading}
                        data={normalData}
                        columns={normalMessageColumn}
                        rowKey="name"
                        tableLayout="auto"
                        verticalAlign="middle"
                        size="small"
                        hover
                    />
                </TabPanel>
            </Tabs>

            <Dialog visible={showRuleModal} onClose={handleCloseCreateModal} cancelBtn={false} confirmBtn={false} header="添加规则">
                <Form onSubmit={handleCreateRule} ref={formRef} colon={true}>
                    <FormItem name="name" label="规则名称"
                              rules={[
                                  {required: true, message: '规则名称必填', type: 'error'},
                                  {max: 30, message: '不能超过30个字符', type: 'error'},
                              ]}
                    >
                        <Input clearable={true} placeholder="请输入名称，不超过30个字符" />
                    </FormItem>
                    <FormItem label="消息类型">
                        {
                            isAuthTab
                                ?
                                <div className="normal_flex">
                                    <p style={{margin: '0 15px 0 0'}}>授权事件</p>
                                    <Popup trigger="hover" showArrow content={authMessageExample} destroyOnClose={true} placement="bottom">
                                        <a className="a">查看示例</a>
                                    </Popup>
                                </div>
                                :
                                <div className="normal_flex">
                                    <p style={{margin: '0 15px 0 0'}}>普通消息与事件</p>
                                    <Popup trigger="hover" showArrow content={normalMessageExample} destroyOnClose={true} placement="bottom">
                                        <a className="a">查看示例</a>
                                    </Popup>
                                </div>
                        }
                    </FormItem>
                    {
                        isAuthTab
                            ?
                            <FormItem name="infoType" label="InfoType"
                                      rules={[
                                          {required: true, message: 'InfoType必填', type: 'error'},
                                      ]}
                            >
                                <Input clearable={true} placeholder="请输入InfoType，例如authorized" />
                            </FormItem>
                            :
                            <>
                                <FormItem name="msgType" label="MsgType"
                                          rules={[
                                              {required: true, message: 'MsgType必填', type: 'error'},
                                          ]}
                                >
                                    <Input clearable={true} placeholder="请输入MsgType，例如Event、Text" />
                                </FormItem>
                                <FormItem name="event" label="Event"
                                          rules={[
                                              {required: true, message: 'Event必填', type: 'error'},
                                          ]}
                                >
                                    <Input clearable={true} placeholder="请输入Event，例如wxa_nickname_audit" />
                                </FormItem>
                            </>
                    }
                    <FormItem name="path" label="目标路径"
                              rules={[
                                  {required: true, message: '目标路径必填', type: 'error'},
                              ]}
                              help={!isAuthTab ? '支持填写带参数的录几个，/$APPID$，如/wxacallback/biz/$APPID$/callback，实际接收消息时$APPID$将被替换为公众号或小程序AppId' : undefined}
                    >
                        <Input clearable={true} placeholder="请输入目标路径，例如/path/ticket" />
                    </FormItem>
                    <FormItem name="port" label="端口"
                              rules={[
                                  {required: true, message: '端口必填', type: 'error'},
                              ]}
                    >
                        <Input clearable={true} type="number" placeholder="请输入转发端口" />
                    </FormItem>
                    <FormItem statusIcon={false}>
                        <Button theme="primary" type="submit" block>
                            添加规则
                        </Button>
                    </FormItem>
                </Form>
            </Dialog>

        </div>
    )
}
