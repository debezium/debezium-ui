export const TRANSFORMS = {
  'io.debezium.transforms.Filter': {
    route: 'filtering',
    originalEvent: {
      topic: 'fullfillment.orders',
      eventHeader: `{}`,
      key: `{ id: 12345 }`,
      value: `{
  "source": { ... },
  "op": "u",
  "ts_ms": 1675177154755,
  "before": { ... },
  "after": {
    "Id": 12345,
    "orderNumber": "1001",
    "customerId": 2001
  }
}`,
    },
    condition: {
      value: [`condition="value.op=='u' && value.after.id==12345"`],
      conditionToggle: true,
    },
    transformedEvent: 'event-pass',
    notMatchingCondition: 'event-drop',
  },
  'io.debezium.transforms.ExtractNewRecordState': {
    route: 'event-flattening',
    originalEvent: {
      topic: 'fullfillment.orders',
      eventHeader: `{}`,
      key: `{ id: 12345 }`,
      value: `{
  "source": { ... },
  "op": "u",
  "ts_ms": 1675177154755,
  "before": { ... },
  "after": {
    "Id": 12345,
    "orderNumber": "1001",
    "customerId": 2001
  }
}`,
    },
    transformedEvent: {
      value: `{
  Id: 12345,
  orderNumber: '1001',
  customerId: 2001,
 }`,
    },
  },
  'io.debezium.transforms.ContentBasedRouter': {
    route: 'content-based-routing',
    originalEvent: {
      topic: 'fullfillment.orders',
      eventHeader: `{}`,
      key: `{ id: 12345 }`,
      value: `{
  "source": { ... },
  "op": "u",
  "ts_ms": 1675177154755,
  "before": { ... },
  "after": {
    "Id": 12345,
    "orderNumber": "1001",
    "customerId": 2001
  }
}`,
    },
    condition: {
      value: [`topic.expression="value.op == 'u' ? order.updates : null"`],
      conditionToggle: true,
    },
    transformedEvent: {
      topic: 'order.updates',
    },
    notMatchingCondition: 'event-pass',
  },
  'io.debezium.transforms.ByLogicalTableRouter': {
    route: 'topic-routing',
    originalEvent: {
      topic: 'fullfillment.orders_shard1',
      eventHeader: `{}`,
      key: `{ id: 12345 }`,
      value: `{
  "source": { ... },
  "op": "u",
  "ts_ms": 1675177154755,
  "before": { ... },
  "after": {
    "Id": 12345,
    "orderNumber": "1001",
    "customerId": 2001
  }
}`,
    },
    condition: {
      value: [
        `topic.regex="(.*)fullfillment.orders_shard(.*)"`,
        `topic.replacement="$1.orders"`,
      ],
      conditionToggle: true,
    },
    transformedEvent: {
      topic: 'fullfillment.orders',
    },
    notMatchingCondition: 'event-pass',
  },
  'org.apache.kafka.connect.transforms.TimestampRouter': {
    route: 'TimestampRouter',
    originalEvent: {
      topic: 'fullfillment.orders_shard1',
      eventHeader: `{}`,
      key: `{ id: 12345 }`,
      value: `{
  "source": { ... },
  "op": "u",
  "ts_ms": 1675177154755,
  "before": { ... },
  "after": {
    "Id": 12345,
    "orderNumber": "1001",
    "customerId": 2001
  }
}`,
    },
    condition: {
      value: [
        'topic.format="foo-${topic}-${timestamp}"',
        `timestamp.format="YYYYMM"`,
      ],
      conditionToggle: true,
    },
    transformedEvent: {
      topic: 'foo-fullfillment.orders-202303',
    },
    notMatchingCondition: 'event-pass',
  },
  'org.apache.kafka.connect.transforms.ValueToKey': {
    route: 'ValueToKey',
    originalEvent: {
      topic: 'fullfillment.orders_shard1',
      eventHeader: `{}`,
      key: `{ id: 12345 }`,
      value: `{
  Id: 12345,
  orderNumber: '1001',
  customerId: 2001,
}`,
    },
    condition: {
      value: [
        'topic.format="foo-${topic}-${timestamp}"',
        `timestamp.format="YYYYMM"`,
      ],
      conditionToggle: false,
    },
    transformedEvent: {
      key: `{ id: 12345, customerId: 2001 }`,
    },
    note: 'This transformation does not support nested structures, so users would likely need to apply ExtractNewRecordState prior to this SMT.',
  },
};
