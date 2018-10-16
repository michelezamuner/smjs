module.exports = class Compiler {
    /**
     * @param {string} code
     * @return {string}
     */
    compile(code) {
        code = this._evaluateBlockTags(code);
        code = this._evaluateEchoTags(code);
        const parts = this._parseText(code);

        return `
.data
    text db ${parts.join(' ')}
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, ${this._getLength(parts)}
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
        `;
    }

    /**
     * @param {string} code
     * @return {string}
     * @private
     */
    _evaluateBlockTags(code) {
        let nonBlockTagIndex = 0;
        let blockTagIndex = code.indexOf('<?php');
        while (blockTagIndex !== -1) {
            const blockTagClosingIndex = code.indexOf('?>', blockTagIndex) + 2;
            if (blockTagClosingIndex < 2) {
                const block = code.substring(blockTagIndex, code.length);
                code = code.replace(block, this._evaluateUnclosedBlockTag(block));
                break;
            }
            const block = code.substring(blockTagIndex, blockTagClosingIndex);
            code = code.replace(block, this._evaluateBlockTag(block));
            nonBlockTagIndex = blockTagClosingIndex;
            blockTagIndex = code.indexOf('<?php', blockTagIndex + 1);
        }

        return code;
    }

    /**
     * @param {string} code
     * @return {string}
     * @private
     */
    _evaluateEchoTags(code) {
        let nonEchoTagIndex = 0;
        let echoTagIndex = code.indexOf('<?=');
        while (echoTagIndex !== -1) {
            const echoTagClosingIndex = code.indexOf('?>', echoTagIndex) + 2;
            const echo = code.substring(echoTagIndex, echoTagClosingIndex);
            code = code.replace(echo, this._evaluateEchoTag(echo));
            nonEchoTagIndex = echoTagClosingIndex;
            echoTagIndex = code.indexOf('<?=', echoTagIndex + 1);
        }

        return code;
    }

    /**
     * @param {string} code
     * @return {Array}
     * @private
     */
    _parseText(code) {
        const text = [];
        const parts = code.split('\n');

        for (const i in parts) {
            if (parts[i] !== '') {
                text.push(`"${parts[i]}"`);
            }
            if (parseInt(i) !== parts.length - 1) {
                text.push(10);
            }
        }

        return text;
    }

    /**
     * @param {Array} parts
     * @return {number}
     * @private
     */
    _getLength(parts) {
        let length = 0;
        for (const part of parts) {
            length += typeof part === 'string' && part.startsWith('"') && part.endsWith('"')
                ? part.length - 2
                : 1;
        }

        return length;
    }

    /**
     * @param {string} block
     * @return {string}
     * @private
     */
    _evaluateBlockTag(block) {
        let match = /<\?php\s+echo '(.*)';?\s+\?>/.exec(block);
        if (match === undefined) {
            match = /<\?php\s+echo "(.*)";?\s+\?>/.exec(block);
        }

        return match[1];
    }

    /**
     * @param {string} echo
     * @return {string}
     * @private
     */
    _evaluateEchoTag(echo) {
        let match = /<?=\s+'(.*)'\s+\?>/.exec(echo);
        if (match === undefined) {
            match = /<?=\s+"(.*)"\s+\?>/.exec(echo);
        }

        return match[1];
    }

    /**
     * @param {string} block
     * @return {string}
     * @private
     */
    _evaluateUnclosedBlockTag(block) {
        let match = /<\?php\s+echo '(.*)';?/.exec(block);
        if (match === undefined) {
            match = /<\?php\s+echo "(.*)";?/.exec(block);
        }

        return match[1];
    }
};
