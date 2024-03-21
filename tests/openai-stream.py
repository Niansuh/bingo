import openai
openai.api_key = "dummy"
openai.api_base = "https://niansuhai-bingo.hf.space" # This can be changed to a service deployed by yourself. The bingo service version needs to be >= 0.9.0

# create a chat completion
completion = openai.ChatCompletion.create(model="Creative", stream=True, messages=[{"role": "user", "content": "Hello"}])
for chat_completion in completion:
    # print the completion
    print(chat_completion.choices[0].message.content, end="", flush=True)
