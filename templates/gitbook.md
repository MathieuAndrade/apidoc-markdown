<% data.forEach(group => { -%>

# <%= group.name %>

<% group.subs.forEach(sub => { -%>
- [<%= sub.name %>](#<%= toLink(sub.name) %>)
<% }) -%>
<% }) -%>

___
<% data.forEach(group => { -%>

<% group.subs.forEach(sub => { -%>

{% api-method method="<%- sub.type.toLowerCase() %>" host=" " path="<%= sub.url %>" %}{% api-method-summary %}<%- sub.name %>{% endapi-method-summary %}

{% api-method-description %}
<%- sub.description %>
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}

{% api-method-path-parameters %}
{% endapi-method-path-parameters %}

{% api-method-headers %} 
<% if (sub.header && sub.header.fields.Header.length) { -%>
<% sub.header.fields.Header.forEach(header => { -%>

{% api-method-parameter name="<%- header.field -%>" type="<%- header.type -%>" required=<%- header.optional ? 'false' : 'true' -%> %}
<%- header.description -%>
{% endapi-method-parameter %}
<% }) // foreach parameter -%>
<% } // if parameters -%>
{% endapi-method-headers %}

{% api-method-query-parameters %}
<% if (sub.parameter && sub.parameter.fields) { -%>
<% Object.keys(sub.parameter.fields).forEach(g => { -%>
<% sub.parameter.fields[g].forEach(param => { -%>

{% api-method-parameter name="<%- param.field -%>" type="<%- param.type -%>" required=<%- param.optional ? 'false' : 'true' -%> %}
<%- param.description -%>
{% endapi-method-parameter %}

<% }) // foreach (group) parameter -%>
<% }) // foreach param parameter -%>
<% } // if parameters -%>
{% endapi-method-query-parameters %}

{% endapi-method-request %}

<% if (sub.success && sub.success.examples && sub.success.examples.length) { -%>
<% sub.success.examples.forEach(example => { -%>
{% api-method-response %}

{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
<%= example.title %>
{% endapi-method-response-example-description %}

```javascript
<%- example.content %>
```
{% endapi-method-response-example %}
{% endapi-method-response %}

<% }) // foreach success example -%>
<% } // if examples -%>
{% endapi-method-spec %}
{% endapi-method %}
<% }) // foreach sub  -%>
<% }) // foreach group -%>
