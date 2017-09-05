const Runtime = class Runtime {
    constructor(env) {
        this.env = env;
    }

    empty() {
        return 'empty';
    }

    toNumber(val) {
        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    }

    toString(val) {
        if (val == null) {
            return '';
        }

        if (typeof val === 'object') {
            return JSON.stringify(val, null, 4);
        }

        return String(val);
    }

    isType(obj, type) {
        const _toString = Object.prototype.toString;

        const list = {
            '[object Object]': 'object',
            '[object Array]': 'array',
            '[object RegExp]': 'regexp',
            '[object String]': 'string'
        };

        return list[_toString.call(obj)] === type;
    }

    async resolveFilter(name) {
        const filters = this.env.filters;
        if (filters[name]) {
            return await filters[name];
        }
    }

    renderClass(staticClass, dynamicClass) {
        const classSet = new Set(staticClass.split(' '));

        if (dynamicClass) {
            if (!this.isType(dynamicClass, 'array')) {
                dynamicClass = [dynamicClass];
            }

            dynamicClass.forEach(dynamic => {
                if (this.isType(dynamic, 'object')) {
                    for (const key in dynamic) {
                        if (dynamic[key]) {
                            classSet.add(key);
                        }
                    }
                }

                if (this.isType(dynamic, 'string')) {
                    classSet.add(dynamic);
                }
            });
        }

        return Array.from(classSet).filter(item => item).join(' ');
    }

    renderStyle(staticStyle, dynamicStyle) {
        const parsedStyle = {};

        staticStyle.split(';').forEach(item => {
            const [name, value] = item.split(':').map(val => val.trim());
            if (value) {
                parsedStyle[name.toLowerCase()] = value;
            }
        });

        const styleMap = {};
        const hyphenate = str => str.replace(/([^-])([A-Z])/g, '$1-$2').toLowerCase();
        const styles = Object.assign({}, parsedStyle, dynamicStyle);

        for (const key in styles) {
            if (styles[key]) {
                styleMap[hyphenate(key)] = styles[key];
            }
        }

        return Object.keys(styleMap).map(key => `${key}:${styleMap[key]};`).join('');
    }

    instence() {
        return {
            _str: this.toString.bind(this),
            _type: this.isType.bind(this),
            _filter: this.resolveFilter.bind(this),
            _class: this.renderClass.bind(this),
            _style: this.renderStyle.bind(this)
        };
    }
};

module.exports = Runtime;
