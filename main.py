from flask import Flask, request, jsonify
import replicate
from uuid import uuid4

app = Flask(__name__)

# In-memory storage for conversation history
conversations = {}


@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    model = data.get('model', '').lower()
    query = data.get('query', '')
    conversation_id = data.get('conversation_id')

    if not model or not query:
        return jsonify({"error": "Both 'model' and 'query' are required"}), 400

    if model not in ['llama2', 'mistral']:
        return jsonify({"error": "Invalid model. Choose either 'llama2' or 'mistral'"}), 400

    if not conversation_id:
        conversation_id = str(uuid4())
        conversations[conversation_id] = []

    try:
        if model == 'llama2':
            output = generate_llama2(query, conversation_id)
        else:
            output = generate_mistral(query, conversation_id)

        return jsonify({"response": output, "conversation_id": conversation_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def generate_llama2(prompt, conversation_id):
    history = conversations[conversation_id]
    full_prompt = "\n".join([f"Human: {h['human']}\nAssistant: {h['ai']}" for h in history])
    full_prompt += f"\nHuman: {prompt}\nAssistant:"

    output = ""
    for event in replicate.stream(
            "meta/llama-2-70b-chat",
            input={
                "top_k": 0,
                "top_p": 1,
                "prompt": full_prompt,
                "max_tokens": 512,
                "temperature": 0.5,
                "system_prompt": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
                "length_penalty": 1,
                "max_new_tokens": 500,
                "min_new_tokens": -1,
                "prompt_template": "<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{prompt} [/INST]",
                "presence_penalty": 0,
                "log_performance_metrics": False
            },
    ):
        output += str(event)

    history.append({"human": prompt, "ai": output})
    conversations[conversation_id] = history
    return output


def generate_mistral(prompt, conversation_id):
    history = conversations[conversation_id]
    full_prompt = "\n".join([f"Human: {h['human']}\nAssistant: {h['ai']}" for h in history])
    full_prompt += f"\nHuman: {prompt}\nAssistant:"

    output = ""
    for event in replicate.stream(
            "mistralai/mistral-7b-instruct-v0.2",
            input={
                "top_k": 50,
                "top_p": 0.9,
                "prompt": full_prompt,
                "temperature": 0.6,
                "system_prompt": "You are a very helpful, respectful and honest assistant.",
                "length_penalty": 1,
                "max_new_tokens": 512,
                "prompt_template": "<s>[INST] {prompt} [/INST] ",
                "presence_penalty": 0
            },
    ):
        output += str(event)

    history.append({"human": prompt, "ai": output})
    conversations[conversation_id] = history
    return output


if __name__ == '__main__':
    app.run(debug=True)