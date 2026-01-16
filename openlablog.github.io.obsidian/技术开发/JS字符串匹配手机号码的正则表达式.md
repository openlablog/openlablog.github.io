---
created: 2026-01-06 15:48:27
modified: 2026-01-16 20:44:55
---

亲测可用，适应所有情况：

```javascript
str = str.replace(/(1[3|4|5|6|7|8|9]\d{9})(((\D{1}|$)[\s\S]*)+)/g, '<a onclick="alert($1)">$1</a>$2');
```
