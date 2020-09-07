package io.debezium.configserver.model;

import java.util.List;

public class AdditionalPropertyMetadata {

    public boolean isMandatory;
    public ConnectorProperty.Category category;
    public List<String> allowedValues = null;

    public AdditionalPropertyMetadata(boolean isMandatory, ConnectorProperty.Category category) {
        this.isMandatory = isMandatory;
        this.category = category;
    }

    public AdditionalPropertyMetadata(boolean isMandatory, ConnectorProperty.Category category, List<String> allowedValues) {
        this.isMandatory = isMandatory;
        this.category = category;
        this.allowedValues = allowedValues;
    }
}
