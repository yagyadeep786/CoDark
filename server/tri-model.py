# from transformers import BertTokenizer, BertForSequenceClassification, XLNetTokenizer ,XLNetForSequenceClassification, RobertaTokenizer, RobertaForSequenceClassification

from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
import torch
import re
import json

# Paths to the fine-tuned models
bert_model_path = r"I:\darkparttren_detection\public\models\DPBH_BERT_Fine_Tuned_Model"
# xlnet_model_path = r"I:\darkparttren_detection\FIne Tuned Code"
# roberta_model_path = r"I:\darkparttren_detection\FIne Tuned Code"

# Load models and tokenizers
bert_tokenizer = BertTokenizer.from_pretrained(bert_model_path)
bert_model = BertForSequenceClassification.from_pretrained(bert_model_path)

# xlnet_tokenizer = XLNetTokenizer.from_pretrained("xlnet-base-cased")
# xlnet_model = XLNetForSequenceClassification.from_pretrained(xlnet_model_path)

# roberta_tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
# roberta_model = RobertaForSequenceClassification.from_pretrained(roberta_model_path)

max_seq_length = 512

def preprocess_text(tokenizer, text):   
    tokens = tokenizer.tokenize(tokenizer.decode(tokenizer.encode(text, add_special_tokens=True, max_length=max_seq_length, truncation=True)))
    return tokens

def predict_dark_patterns(models, tokenizers, input_text):
    votes = []

    for model, tokenizer in zip(models, tokenizers):
        input_ids = tokenizer.encode(preprocess_text(tokenizer, input_text), return_tensors='pt', max_length=max_seq_length, truncation=True)

        with torch.no_grad():
            outputs = model(input_ids)

        probs = softmax(outputs.logits, dim=1).squeeze()
        predicted_category = torch.argmax(probs).item()

        votes.append(predicted_category)

    return votes

def count_dark_patterns(text_file):
    with open(text_file, 'r', encoding='utf-8') as file:
        text_content = file.read()

    # Map category names to numeric labels
    category_mapping = {"Urgency": 0, "Not Dark Pattern": 1, "Scarcity": 2, "Misdirection": 3, "Social Proof": 4,
                        "Obstruction": 5, "Sneaking": 6, "Forced Action": 7}

    dark_patterns = {category: 0 for category in category_mapping}

    sentences = re.split(r'[\n]', text_content)

    ans= {
        "Urgency":[],
        "Scarcity":[],
        "Misdirection":[],
        "Obstruction":[],
        "Sneaking":[],
        "Forced Action":[],
        "Social Proof":[]
    }
    for sentence in sentences:
        if not sentence.strip():
            continue


        # individual_predictions = predict_dark_patterns([bert_model, xlnet_model, roberta_model],
        #                                               [bert_tokenizer, xlnet_tokenizer, roberta_tokenizer],
        #                                               sentence)
        
        individual_predictions = predict_dark_patterns([bert_model],
                                                      [bert_tokenizer],
                                                      sentence)

        # Get majority voted prediction
        majority_category = max(set(individual_predictions), key=individual_predictions.count)
        category_name = next(key for key, value in category_mapping.items() if value == majority_category)

        # print(category_name)
        if (category_name != "Not Dark Pattern"):
            ans[category_name].append(sentence)
        # dark_patterns[category_name] += 1
    
    return ans


result = count_dark_patterns('./output.txt')


# print(result)

# print("The result is: ",result)
# result.pop("Not Dark Pattern", None)
# arr = []

# for key in result:
#     print(key)

# for category, count in result.items():
#     print(f"{category}: {count}")
#     data_to_share = {category : count} 
#     arr.append(data_to_share) 

json_data = json.dumps(result)
with open('data.json', 'w') as json_file:
    json_file.write(json_data)

# for key in result:
#     print(len(key))