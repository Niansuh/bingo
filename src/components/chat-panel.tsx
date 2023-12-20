'use client'

import React, { useCallback, useEffect, KeyboardEvent } from 'react'
import Textarea from 'react-textarea-autosize'
import { useAtomValue } from 'jotai'
import { cn } from '@/lib/utils'

import NewTopic from '@/assets/images/new-topic.svg'
import VisualSearchIcon from '@/assets/images/visual-search.svg'
import SendFillIcon from '@/assets/images/send-fill.svg'
import SendIcon from '@/assets/images/send.svg'

import { BingReturnType } from '@/lib/hooks/use-bing'
import { voiceListenAtom } from '@/state'
import Voice from './voice'
import { ChatImage } from './chat-image'
import { ChatAttachments } from './chat-attachments'
import { SVG } from './ui/svg'
import { ChatPrompts } from './chat-prompts'
import { debug } from '@/lib/isomorphic'

export interface ChatPanelProps
  extends Pick<
    BingReturnType,
    | 'generating'
    | 'input'
    | 'setInput'
    | 'sendMessage'
    | 'resetConversation'
    | 'isSpeaking'
    | 'attachmentList'
    | 'uploadImage'
    | 'setAttachmentList'
  > {
  id?: string
  className?: string
}

export function ChatPanel({
  isSpeaking,
  generating,
  input,
  setInput,
  className,
  sendMessage,
  resetConversation,
  attachmentList,
  uploadImage,
  setAttachmentList
}: ChatPanelProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const [focused, setFocused] = React.useState(false)
  const [tid, setTid] = React.useState<any>()
  const voiceListening = useAtomValue(voiceListenAtom)

  const onSend = useCallback(async () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.offsetHeight,
        behavior: 'smooth'
      })
    }, 200)

    if (generating) {
      return;
    }
    const input = inputRef.current?.value || ''
    if (!input?.trim()) {
      return
    }
    setInput('')
    await sendMessage(input)
  }, [generating, input, sendMessage, setInput])

  const onSubmit = useCallback(async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    debug('event key', event.key)
    if (
      event.shiftKey ||
      event.ctrlKey ||
      event.nativeEvent.isComposing ||
      event.key !== 'Enter'
    ) {
      return
    }
    event.preventDefault()

    onSend()
  }, [onSend, generating, attachmentList])

  const setBlur = useCallback(() => {
    clearTimeout(tid)
    const _tid = setTimeout(() => setFocused(false), 2000);
    setTid(_tid)
  }, [tid])

  const setFocus = useCallback(() => {
    setFocused(true)
    clearTimeout(tid)
    inputRef.current?.focus()
  }, [tid])

  useEffect(() => {
    if (input) {
      setFocus()
    }

  }, [input, setFocus])

  return (
    <div className={cn('chat-panel relative', className)}>
      <div className="action-bar pb-4">
        <div className="action-root" speech-state="hidden" visual-search="" drop-target="">
          <div className="fade bottom">
            <div className="background"></div>
          </div>
          <div className={cn('outside-left-container', { collapsed: focused })}>
            <div className="button-compose-wrapper">
              <button className="body-2 button-compose" type="button" aria-label="New topic" onClick={resetConversation}>
                <div className="button-compose-content">
                  <SVG className="pl-2" alt="new topic" src={NewTopic} width={40} fill="currentColor" />
                  <div className="button-compose-text">New topic</div>
                </div>
              </button>
            </div>
          </div>
          <div
            className={cn('main-container')}
            onClick={setFocus}
            onBlur={setBlur}
          >
            {input.startsWith('/') && (
              <ChatPrompts onChange={setInput} filter={input.slice(1)} />
            )}

            <div className="main-bar">
              <Textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={onSubmit}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value.slice(0, 8000))}
                placeholder={voiceListening ? 'The conversation is ongoing... Just say "Send" when the conversation is complete' : 'Shift + Enter to change the line, enter/select the prompt word'}
                spellCheck={false}
                className="message-input min-h-[24px] w-full text-base resize-none bg-transparent focus-within:outline-none"
              />
              <Voice className="action-button" setInput={setInput} sendMessage={sendMessage} isSpeaking={isSpeaking} input={input} />
            </div>
            <ChatAttachments attachmentList={attachmentList} setAttachmentList={setAttachmentList} uploadImage={uploadImage} />
            <div className="body-1 bottom-bar">
              <div className="action-button">
                <ChatImage uploadImage={uploadImage}>
                  <SVG className="cursor-pointer" src={VisualSearchIcon} width={20} />
                </ChatImage>
              </div>
              <div className="flex gap-2 items-center">
                <div className="letter-counter"><span>{input.length}</span>/8000</div>
                <button type="submit" className="action-button" onClick={onSend}>
                  <SVG alt="send" src={input.length ? SendFillIcon : SendIcon} width={18} height={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
<ins class="adsbygoogle" data-ad-client="ca-pub-9305116526229590" data-ad-format="auto" data-ad-host="ca-host-pub-2885846345242349" data-ad-status="filled" data-adsbygoogle-status="done" style="display: block; height: 280px;"><div aria-label="Advertisement" id="aswift_8_host" style="border: none; height: 280px; width: 600px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: inline-block; overflow: visible;" tabindex="0" title="Advertisement"><iframe allow="attribution-reporting" allowtransparency="true" browsingtopics="true" data-google-container-id="a!9" data-google-query-id="CNXaj56Xg4MDFVlFHQkdjEoF3g" data-load-complete="true" frameborder="0" height="280" hspace="0" id="aswift_8" marginheight="0" marginwidth="0" name="aswift_8" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" scrolling="no" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-9305116526229590&amp;output=html&amp;h=280&amp;adk=4219771717&amp;adf=129315941&amp;w=600&amp;fwrn=4&amp;fwrnh=100&amp;lmt=1702153310&amp;rafmt=1&amp;format=600x280&amp;url=https%3A%2F%2Fheylink.me%2Fniansuh&amp;ea=0&amp;host=ca-host-pub-2885846345242349&amp;fwr=0&amp;rpe=1&amp;resp_fmts=3&amp;wgl=1&amp;uach=WyJXaW5kb3dzIiwiMTQuMC4wIiwieDg2IiwiIiwiMTIwLjAuNjA5OS43MSIsbnVsbCwwLG51bGwsIjY0IixbWyJOb3RfQSBCcmFuZCIsIjguMC4wLjAiXSxbIkNocm9taXVtIiwiMTIwLjAuNjA5OS43MSJdLFsiR29vZ2xlIENocm9tZSIsIjEyMC4wLjYwOTkuNzEiXV0sMF0.&amp;dt=1702153306661&amp;bpp=1&amp;bdt=1268&amp;idt=735&amp;shv=r20231206&amp;mjsv=m202312060101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3D20381383da9cd6a4%3AT%3D1701713121%3ART%3D1702153313%3AS%3DALNI_MbbWILrRKpYvJQ-pk03aWTOoB0g0w&amp;gpic=UID%3D00000ce2f2697333%3AT%3D1701713121%3ART%3D1702153313%3AS%3DALNI_ManFm3Wlmhx-PJ3HFS96lqhoDm-Ow&amp;prev_fmts=600x280%2C600x280%2C600x280%2C600x280%2C600x280%2C600x280%2C600x280%2C600x280%2C300x600%2C300x600%2C300x600%2C300x600%2C0x0&amp;nras=1&amp;correlator=1716962085591&amp;frm=20&amp;pv=1&amp;ga_vid=1929332926.1701369607&amp;ga_sid=1702153307&amp;ga_hid=913130595&amp;ga_fc=1&amp;u_tz=300&amp;u_his=2&amp;u_h=1080&amp;u_w=1920&amp;u_ah=1032&amp;u_aw=1920&amp;u_cd=24&amp;u_sd=1&amp;dmc=8&amp;adx=652&amp;ady=3890&amp;biw=1903&amp;bih=955&amp;scr_x=0&amp;scr_y=71&amp;eid=44759876%2C44759927%2C31079758%2C31079924%2C42531706%2C42532524%2C31080064%2C95320870%2C95320885%2C95320889%2C31078663%2C31078665%2C31078668%2C31078670&amp;oid=2&amp;psts=AOrYGsmdBwTKGO6dzqUcEfVYZPxE4L1q2sUdkxrBfrBvrah00DkLyhzwAmUQ44tCBbRHGi8o6t_uN3_yOTdqWL7tQ9YpojNs%2CAOrYGsnK-qlJ0GzW2-Rr153DqqfPptaqwgtnIrl5zBDmF9LYgPQiu0AmqIouLekW-NEJRfX4o937VhfxjH8hDZIlDsLQvd22%2CAOrYGsm_4NlkbM-ExrGErYAz4YpWDofRR96BMPDL7WLN1TdYy1zdRV3Du8yvx2gAsRm2UyuLz-yTSyVKz-o2POAc%2CAOrYGsnCA2dincCAuI0_E6n9mfhc3OniPYrGxzqU8TkMgQEzsemEzLXJntYeBxX2mzIAIUuC4EE-DPLpYc9p4e3htQgP5HTT%2CAOrYGslIRk56_g5aRWqIfGjfR1rl0dro9mUd06_QcHoy46l3APiINQ9rSBJ-igcZjQU6xltaN0XmrE2aVMHlJw9QHK5PAXyP%2CAOrYGsny9fQLYiyf19XOLnj3kfnmqwwGwkC-TY3ASjhgWJjnzU5lz6UhndmPqSfQu6AcLHNnxWUdx7Sl6roPV5NwQpE3uqN1%2CAOrYGskvSrLSMs6wsCljQ4qdNr0e9apj0lX7MAU4LmXHMn3sWrq13C8u89swn_V_Pdwvv5ZNrZsNtbBz1HjDS05_YIUoMItp%2CAOrYGsmOBCCrRkxtSUQr8csKzRSVmVcSy2hGzh439Sc-CUqbMv_oPimePNT7C-ZC8gt7A-Pc6Ok6acuwvSehW9nNr4b5xi-M%2CAOrYGsm6od5Z--3czEbDCJ_Gp42IHemAx-Wi7OkuESNTh0614pEb_LRWDuZZrZfHpxQd2p4Y2WjWymp4e-nz0DU_3tAUqKlk%2CAOrYGslSBoxJTysB8X8JLbCk6NtbP96FIqdieh_KyyxcNT1czSafTq7OwljnPzrYWgwwlto7AJQ68TmG5ZEKJuaxdQ&amp;pvsid=2705129312981570&amp;tmod=580331878&amp;uas=3&amp;nvt=1&amp;fc=896&amp;brdim=0%2C0%2C0%2C0%2C1920%2C0%2C1920%2C1032%2C1920%2C955&amp;vis=1&amp;rsz=o%7C%7CeEbr%7C&amp;abl=CS&amp;pfx=0&amp;fu=128&amp;bc=31&amp;td=1&amp;psd=W251bGwsbnVsbCwibGFiZWxfb25seV8yIiwxXQ..&amp;nt=1&amp;ifi=9&amp;uci=a!9&amp;btvi=7&amp;fsb=1&amp;dtd=3702" style="left:0;position:absolute;top:0;border:0;width:600px;height:280px;" vspace="0" width="600"></iframe></div></ins>
