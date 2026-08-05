export interface XmlAttribute {
  name: string;
  value: string;
}

export type XmlChild = XmlElement | string;

export class XmlElement {
  private attributes: XmlAttribute[] = [];
  private children: XmlChild[] = [];
  private namespaces: Record<string, string> = {};

  constructor(
    private readonly namespace: string,
    private readonly qualifiedName: string,
    private readonly nsUri: string
  ) {}

  getNamespaceUri(): string {
    return this.nsUri;
  }

  declareNamespace(prefix: string, uri: string): this {
    this.namespaces[prefix] = uri;
    return this;
  }

  setAttribute(name: string, value: string | number | null | undefined): this {
    if (value === null || value === undefined) {
      return this;
    }
    this.attributes.push({ name, value: String(value) });
    return this;
  }

  appendChild(child: XmlChild): this {
    this.children.push(child);
    return this;
  }

  toString(): string {
    const tag = this.namespace ? `${this.namespace}:${this.qualifiedName}` : this.qualifiedName;
    const attrParts: string[] = [];

    for (const [prefix, uri] of Object.entries(this.namespaces)) {
      attrParts.push(`xmlns:${this.escapeAttr(prefix)}="${this.escapeAttr(uri)}"`);
    }

    for (const attr of this.attributes) {
      attrParts.push(`${this.escapeAttr(attr.name)}="${this.escapeAttr(attr.value)}"`);
    }

    const attrString = attrParts.length > 0 ? ' ' + attrParts.join(' ') : '';

    if (this.children.length === 0) {
      return `<${tag}${attrString}/>`;
    }

    const childrenXml = this.children
      .map((c) => (typeof c === 'string' ? this.escapeText(c) : c.toString()))
      .join('');

    return `<${tag}${attrString}>${childrenXml}</${tag}>`;
  }

  private escapeAttr(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private escapeText(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

export function xmlDocument(root: XmlElement): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${root.toString()}`;
}
