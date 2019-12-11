<a name="top"></a>
<% data.forEach(group => { -%>
<span style="font-size:2em;">**<%= group.name %>**</span>
___

<% group.subs.forEach(sub => { -%>
- [<%= sub.name %>](#<%= toLink(sub.name) %>)
<% }) -%>
<% }) -%>

<span style="font-size:2em;">**Routes**</span>
<% data.forEach(group => { -%>
<% group.subs.forEach(sub => { -%>
___
### <a name='<%= toLink(sub.name) %>'></a> <%= sub.name %>

<%- sub.description %>

```
<%- sub.type.toUpperCase() %> <%= sub.url %>
```
<% if (sub.header && sub.header.fields.Header.length) { -%>

#### Headers
| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
<% sub.header.fields.Header.forEach(header => { -%>
| <%- header.field -%> &nbsp;&nbsp; <%- header.optional ? '<span style="font-size:0.9em;">``optional``</span>' : '' -%>| <%- header.type -%> |<%- header.description -%>
<% }) // foreach parameter -%>
<% } // if parameters -%>

<% if (sub.header && sub.header.examples && sub.header.examples.length) { -%>

#### Header Examples
<% sub.header.examples.forEach(example => { -%>
```
<%- example.content %>
```
<% }) // foreach example -%>
<% } // if example -%>

<% if (sub.parameter && sub.parameter.fields) { -%>
<% Object.keys(sub.parameter.fields).forEach(g => { -%>

#### Parameters
| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
<% sub.parameter.fields[g].forEach(param => { -%>
| <%- param.field -%> &nbsp;&nbsp; <%- param.optional ? '<span style="font-size:0.9em;">``optional``</span>' : '' -%>| `<%- param.type -%>` |<%- param.description -%>
<% if (param.defaultValue) { -%>
_Default value: <%= param.defaultValue %>_<br><% } -%>
<% if (param.size) { -%>
_Size range: <%- param.size %>_<br><% } -%>
<% if (param.allowedValues) { -%>
_Allowed values: <%- param.allowedValues %>_<% } -%> |
<% }) // foreach (group) parameter -%>
<% }) // foreach param parameter -%>
<% } // if parameters -%>
<% if (sub.examples && sub.examples.length) { -%>

#### Examples
<% sub.examples.forEach(example => { -%>
<%= example.title %>

```
<%- example.content %>
```
<% }) // foreach example -%>
<% } // if example -%>

<% if (sub.parameter && sub.parameter.examples && sub.parameter.examples.length) { -%>

#### Param Examples
<% sub.parameter.examples.forEach(exampleParam => { -%>
`<%= exampleParam.type %>` - <%= exampleParam.title %>

```<%= exampleParam.type %>
<%- exampleParam.content %>
```
<% }) // foreach exampleParam -%>
<% } // if exampleParam -%>

<% if (sub.success && sub.success.fields) { -%>

#### Success

<% Object.keys(sub.success.fields).forEach(g => { -%>

| Name     | Type       | Description                           |
|:---------|:-----------|:--------------------------------------|
<% sub.success.fields[g].forEach(param => { -%>
| <%- param.field -%> &nbsp;&nbsp; <%- param.optional ? '<span style="font-size:0.9em;">``optional``</span>' : '' -%>| `<%- param.type -%>` |<%- param.description -%>
<% if (param.defaultValue) { -%>
_Default value: <%- param.defaultValue %>_<br><% } -%>
<% if (param.size) { -%>
_Size range: <%- param.size -%>_<br><% } -%>
<% if (param.allowedValues) { -%>
_Allowed values: <%- param.allowedValues %>_<% } -%> |
<% }) // foreach (group) parameter -%>
<% }) // foreach field -%>
<% } // if success.fields -%>

<% if (sub.success && sub.success.examples && sub.success.examples.length) { -%>

#### Success Examples
<% sub.success.examples.forEach(example => { -%>

```
<%- example.content %>
```
<% }) // foreach success example -%>
<% } // if examples -%>

<% if (sub.error && sub.error.examples && sub.error.examples.length) { -%>

#### Error

<% if (sub.error && sub.error.fields) { -%>
<% Object.keys(sub.error.fields).forEach(g => { -%>

| Error    | Description                           |
|:---------|:--------------------------------------|
<% sub.error.fields[g].forEach(param => { -%>
| <%- param.field %> | <%- param.description -%> |
<% }) // foreach (group) parameter -%>
<% }) // foreach field -%>
<% } // if error.fields -%>

#### Error Examples
<% sub.error.examples.forEach(example => { -%>

```
<%- example.content %>
```
<% }) // foreach error example -%>
<% } // if examples -%>

<% }) // foreach sub  -%>
<% }) // foreach group -%>
