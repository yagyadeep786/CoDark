function load_models():
    try:
        # Load BERT model
        bert_tokenizer = BertTokenizer.from_pretrained(bert_model_path)
        bert_model = BertForSequenceClassification.from_pretrained(bert_model_path)

        # Load XLNet model
        xlnet_tokenizer = XLNetTokenizer.from_pretrained("xlnet-base-cased")
        xlnet_model = XLNetForSequenceClassification.from_pretrained(xlnet_model_path)

        # Load Roberta model
        roberta_tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
        roberta_model = RobertaForSequenceClassification.from_pretrained(roberta_model_path)
    except Exception as e:
        print("Error loading models:", e)
        exit()

    return bert_tokenizer, bert_model, xlnet_tokenizer, xlnet_model, roberta_tokenizer, roberta_model

function preprocess_text(tokenizer, text):
    # Tokenize and preprocess input text
    tokens = tokenizer.tokenize(
        tokenizer.decode(
            tokenizer.encode(
                text,
                add_special_tokens=True,
                max_length=max_seq_length,
                truncation=True,
            )
        )
    )
    return tokens

function predict_dark_patterns(models, tokenizers, input_text):
    # Make predictions using the loaded models
    votes = []

    for model, tokenizer in zip(models, tokenizers):
        input_ids = tokenizer.encode(
            preprocess_text(tokenizer, input_text),
            return_tensors="pt",
            max_length=max_seq_length,
            truncation=True,
        )

        with torch.no_grad():
            outputs = model(input_ids)

        probs = softmax(outputs.logits, dim=1).squeeze()
        predicted_category = torch.argmax(probs).item()

        votes.append(predicted_category)

    return votes

function count_dark_patterns(text_file, models, tokenizers):
    try:
        # Read text content from the file
        with open(text_file, "r", encoding="utf-8") as file:
            text_content = file.read()

        # Map category names to numeric labels
        category_mapping = {...}  # Mapping of category names to numeric labels

        dark_patterns = {category: 0 for category in category_mapping}

        sentences = re.split(r"[.!?]", text_content)

        for sentence in sentences:
            if not sentence.strip():
                continue

            individual_predictions = predict_dark_patterns(models, tokenizers, sentence)

            # Get majority voted prediction
            majority_category = max(
                set(individual_predictions), key=individual_predictions.count
            )
            category_name = ...  # Map numeric label to category name

            dark_patterns[category_name] += 1

        return dark_patterns
    except Exception as e:
        print("Error during processing:", e)
        return None

# Main execution
bert_tokenizer, bert_model, xlnet_tokenizer, xlnet_model, roberta_tokenizer, roberta_model = load_models()
models = [bert_model, xlnet_model, roberta_model]
tokenizers = [bert_tokenizer, xlnet_tokenizer, roberta_tokenizer]

result = count_dark_patterns("./output.txt", models, tokenizers)

if result is not None:
    for category, count in result.items():
        print(f"{category}: {count} occurrences")
