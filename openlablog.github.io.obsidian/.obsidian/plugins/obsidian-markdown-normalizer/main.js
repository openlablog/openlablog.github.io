const { Plugin, MarkdownView, Notice } = require("obsidian");

/**
 * 核心解析函数：使用状态机来安全地格式化 Markdown 文本
 * @param {string} text - 原始文本
 * @returns {{text: string, count: number}} - 返回处理后的文本和总修改次数
 */
function normalizeMarkdown(text) {
  const PUNCTUATION = `,."?!;:'()[]{}，。？！；：（）《》“”‘’`;
  const lines = text.split('\n');
  let resultLines = [];
  let changesCount = 0;

  const STATE = {
    NORMAL: 'NORMAL',
    IN_FENCED_CODE: 'IN_FENCED_CODE',
    IN_MATH_BLOCK: 'IN_MATH_BLOCK',
  };
  let currentState = STATE.NORMAL;
  let fencedCodeBlockMarker = '';

  for (const line of lines) {
    if (currentState === STATE.NORMAL) {
      if (line.trim().startsWith('```')) {
        currentState = STATE.IN_FENCED_CODE; fencedCodeBlockMarker = '```'; resultLines.push(line); continue;
      }
      if (line.trim().startsWith('~~~')) {
        currentState = STATE.IN_FENCED_CODE; fencedCodeBlockMarker = '~~~'; resultLines.push(line); continue;
      }
      if (line.trim() === '$$') {
        currentState = STATE.IN_MATH_BLOCK; resultLines.push(line); continue;
      }
    }
    if (currentState === STATE.IN_FENCED_CODE && line.trim() === fencedCodeBlockMarker) {
      currentState = STATE.NORMAL; resultLines.push(line); continue;
    }
    if (currentState === STATE.IN_MATH_BLOCK && line.trim() === '$$') {
      currentState = STATE.NORMAL; resultLines.push(line); continue;
    }
    if (currentState !== STATE.NORMAL) {
      resultLines.push(line); continue;
    }
    if (line.trim().startsWith('>')) {
      resultLines.push(line); continue;
    }
    const hrRegex = /^\s*([*_-])(\s*\1\s*){2,}\s*$/;
    if (hrRegex.test(line)) {
      resultLines.push(line); continue;
    }

    let resultLine = "";
    let i = 0;
    let isInlineCode = false, isInlineMath = false, isComment = false;
    let boldCount = 0, italicCount = 0;
    const listMatch = line.match(/^\s*([-*+])\s/);
    const isList = listMatch !== null;
    const listMarkerPos = isList ? line.indexOf(listMatch[1]) : -1;

    while (i < line.length) {
      if (isList && i === listMarkerPos) { resultLine += line[i]; i++; continue; }
      if (line[i] === '`') { isInlineCode = !isInlineCode; resultLine += '`'; i++; continue; }
      if (line[i] === '$' && !isInlineCode) { isInlineMath = !isInlineMath; resultLine += '$'; i++; continue; }
      if (line.startsWith('%%', i)) { isComment = !isComment; resultLine += '%%'; i += 2; continue; }
      if (isInlineCode || isInlineMath || isComment) { resultLine += line[i]; i++; continue; }
      if (line[i] === '\\' && i + 1 < line.length) { resultLine += line.substring(i, i + 2); i += 2; continue; }
      
      if (line.startsWith('**', i)) {
        boldCount++;
        const marker = '**';
        if (boldCount % 2 === 1) { // Start marker
          if (line[i+2] === ' ') {
            resultLine += marker; i += 3; changesCount++;
          } else {
            if (PUNCTUATION.includes(line[i+2])) {
              if (resultLine.length > 0 && !/\s$/.test(resultLine)) { resultLine += ' '; changesCount++; }
            }
            resultLine += marker; i += 2;
          }
        } else { // End marker
          if (/\s$/.test(resultLine)) { resultLine = resultLine.slice(0, -1); changesCount++; }
          resultLine += marker; i += 2;
          
          const charBeforeMarker = resultLine[resultLine.length - (marker.length + 1)] || '';
          if (PUNCTUATION.includes(charBeforeMarker)) {
            const charAfterMarker = line[i] || '';
            // --- 正则表达式 ---
            const needsSpaceRegex = /[\u4e00-\u9fa5\da-zA-Z]/; // 匹配汉字、数字或字母
            if (needsSpaceRegex.test(charAfterMarker)) {
              resultLine += ' '; changesCount++;
            }
          }
        }
        continue;
      } else if (line.startsWith('*', i)) {
        italicCount++;
        const marker = '*';
        if (italicCount % 2 === 1) { // Start marker
          if (line[i+1] === ' ') {
            resultLine += marker; i += 2; changesCount++;
          } else {
            if (PUNCTUATION.includes(line[i+1])) {
              if (resultLine.length > 0 && !/\s$/.test(resultLine)) { resultLine += ' '; changesCount++; }
            }
            resultLine += marker; i++;
          }
        } else { // End marker
          if (/\s$/.test(resultLine)) { resultLine = resultLine.slice(0, -1); changesCount++; }
          resultLine += marker; i++;
          
          const charBeforeMarker = resultLine[resultLine.length - (marker.length + 1)] || '';
          if (PUNCTUATION.includes(charBeforeMarker)) {
            const charAfterMarker = line[i] || '';
            // --- 正则表达式 ---
            const needsSpaceRegex = /[\u4e00-\u9fa5\da-zA-Z]/; // 匹配汉字、数字或字母
            if (needsSpaceRegex.test(charAfterMarker)) {
              resultLine += ' '; changesCount++;
            }
          }
        }
        continue;
      }

      resultLine += line[i]; i++;
    }
    resultLines.push(resultLine);
  }

  return { text: resultLines.join('\n'), count: changesCount };
}

class FormattingNormalizerPlugin extends Plugin {
  async onload() {
    console.log("Formatting Normalizer plugin loaded.");
    this.addRibbonIcon("asterisk", "修复格式渲染", () => {
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (activeView) { this.normalizeEditor(activeView.editor); }
      else { new Notice("请先打开一个文件"); }
    });
    this.addCommand({
      id: "normalize-formatting-text",
      name: "修复粗体和斜体渲染",
      editorCallback: (editor, view) => { this.normalizeEditor(editor); },
    });
  }

  normalizeEditor(editor) {
    if (!editor) return;
    const originalText = editor.getValue();
    const { text: newText, count: fixCount } = normalizeMarkdown(originalText);
    if (originalText !== newText) {
      const cursor = editor.getCursor();
      const scrollInfo = editor.getScrollInfo();
      editor.setValue(newText);
      setTimeout(() => {
        editor.setCursor(cursor);
        editor.scrollTo(scrollInfo.left, scrollInfo.top);
      }, 0);
      new Notice(`已修复[${fixCount}]处内容`);
    } else {
      new Notice("没有可更改的内容");
    }
  }

  onunload() {
    console.log("Formatting Normalizer plugin unloaded.");
  }
}

module.exports = FormattingNormalizerPlugin;