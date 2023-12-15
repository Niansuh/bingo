'use client'

import React, { useCallback, useEffect, KeyboardEvent, useRef, useState } from 'react';
import Textarea from 'react-textarea-autosize';
import { useAtomValue } from 'jotai';
import { cn } from '@/lib/utils';

// ... (import statements for images and other components)

import { BingReturnType } from '@/lib/hooks/use-bing';
import { voiceListenAtom } from '@/state';
import Voice from './voice';
import { ChatImage } from './chat-image';
import { ChatAttachments } from './chat-attachments';
import { SVG } from './ui/svg';
import { ChatPrompts } from './chat-prompts';
import { debug } from '@/lib/isomorphic';

import NewTopic from '@/assets/images/new-topic.svg';
import VisualSearchIcon from '@/assets/images/visual-search.svg';
import SendFillIcon from '@/assets/images/send-fill.svg';
import SendIcon from '@/assets/images/send.svg';

export interface ChatPanelProps extends Pick<BingReturnType, 'generating' | 'input' | 'setInput' | 'sendMessage' | 'resetConversation' | 'isSpeaking' | 'attachmentList' | 'uploadImage' | 'setAttachmentList'> {
  id?: string;
  className?: string;
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [tid, setTid] = useState<any>();
  const voiceListening = useAtomValue(voiceListenAtom);

  const onSend = useCallback(async () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.offsetHeight,
        behavior: 'smooth'
      });
    }, 200);

    if (generating) {
      return;
    }

    const inputValue = inputRef.current?.value || '';
    if (!inputValue.trim()) {
      return;
    }

    setInput('');
    await sendMessage(inputValue);
  }, [generating, setInput, sendMessage]);

  const onSubmit = useCallback(
    async (event: KeyboardEvent<HTMLTextAreaElement>) => {
      debug('event key', event.key);

      if (
        event.shiftKey ||
        event.ctrlKey ||
        event.nativeEvent.isComposing ||
        event.key !== 'Enter'
      ) {
        return;
      }

      event.preventDefault();
      onSend();
    },
    [onSend, generating]
  );

  const setBlur = useCallback(() => {
    clearTimeout(tid);
    const _tid = setTimeout(() => setFocused(false), 2000);
    setTid(_tid);
  }, [tid]);

  const setFocus = useCallback(() => {
    setFocused(true);
    clearTimeout(tid);
    inputRef.current?.focus();
  }, [tid]);

  useEffect(() => {
    if (input) {
      setFocus();
    }
  }, [input, setFocus]);

  return (
    <div className={cn('chat-panel relative', className)}>
      <div className="action-bar pb-4">
        {/* ... (rest of the code remains unchanged) */}
        <div className={cn('outside-left-container', { collapsed: focused })}>
          <div className="button-compose-wrapper">
            <button className="body-2 button-compose" type="button" aria-label="New topic" onClick={resetConversation}>
              <div className="button-compose-content">
                <SVG className="pl-2" alt="new topic" src={NewTopic} width={20} fill="currentColor" />
                <div className="button-compose-text">{focused ? 'Hide topic' : 'New topic'}</div>
              </div>
            </button>
          </div>
        </div>
        {/* ... (rest of the code remains unchanged) */}
      </div>
    </div>
  );
}
