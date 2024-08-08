# LLAMA2 With Mistral app

### Technologies

- Python
- Replicate (A tool to help in running machine learning models from the code) (https://replicate.com/)
- Nest js

## Installation and Running the Application

- Clone the repository using: `git clone https://github.com/Christian-pprogrammer/llama2-mistral-llm.git`
- Access the replicate api token to use from [[https://replicate.com](https://replicate.com/account/api-tokens)]
- open the file Dockerfile in the root and search for the line that says `REPLICATE_API_TOKEN=r8_DHP1vOdyPnkANBFGXtYDtCddeomLQVl0aVA99`. Replace this token with the token obtained from replicate
- Run `docker-compose -f docker-compose.yml build`
- Run `docker-compose -f docker-compose.yml up`

## Testing the application

- Open postman
- Hit a post request on this link [[http://127.0.0.1:3000/conversation/create](http://127.0.0.1:3000/conversation/create)], with this body:
    ```
      {
          "model": "mistral",
          "query": "Who is Tylor swift"
      }
    ```
    This will create new conversation and ask for you this first question and return a response containing the _id that you will use for further requests on this conversation

  - For further requests on this conversation, please use this link [[http://127.0.0.1:3000/conversation/continue/{id}]], where id is the _id returned from your create conversation response.
 
  - To list all conversations, hit a get request on [[http://127.0.0.1:3000/conversation/list]]
  - To get conversation details, hit a get request on [[http://127.0.0.1:3000/conversation/{id}]], where id is the _id of the conversation

