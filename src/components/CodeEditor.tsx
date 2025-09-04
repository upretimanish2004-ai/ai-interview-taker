import React from 'react';
import Editor from 'react-simple-code-editor';
import prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';

interface CodeEditorProps {
  content: string;
  setContent: (value: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ content, setContent, language }) => {
    const highlight = (code: string) => {
        try {
            return prism.highlight(code, prism.languages[language] || prism.languages.clike, language);
        } catch (e) {
            console.error(e);
            return code; // return original code on error
        }
    }

  return (
    <div className="h-full w-full bg-[#282c34] p-2 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
            <Editor
                value={content}
                onValueChange={code => setContent(code)}
                highlight={highlight}
                padding={10}
                className="h-full w-full"
                style={{
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    fontSize: 14,
                    lineHeight: '1.5',
                    minHeight: '100%',
                }}
            />
        </div>
    </div>
  );
};