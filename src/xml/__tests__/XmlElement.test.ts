import { XmlAttribute, xmlDocument, XmlElement } from '../XmlElement';

describe('XmlElement', () => {
  describe('toString basics', () => {
    it('should serialize self-closing element when no children', () => {
      const el = new XmlElement('cfdi', 'Comprobante', 'http://www.sat.gob.mx/cfd/4');
      expect(el.toString()).toBe('<cfdi:Comprobante/>');
    });

    it('should serialize element with no namespace prefix when namespace is empty', () => {
      const el = new XmlElement('', 'Foo', '');
      el.setAttribute('x', '1');
      expect(el.toString()).toBe('<Foo x="1"/>');
    });

    it('should serialize element with text child', () => {
      const el = new XmlElement('', 'Foo', '');
      el.appendChild('hello');
      expect(el.toString()).toBe('<Foo>hello</Foo>');
    });

    it('should serialize nested elements', () => {
      const root = new XmlElement('cfdi', 'Comprobante', 'ns');
      const child = new XmlElement('cfdi', 'Emisor', 'ns');
      child.setAttribute('Rfc', 'XAXX010101000');
      root.appendChild(child);

      expect(root.toString()).toBe(
        '<cfdi:Comprobante><cfdi:Emisor Rfc="XAXX010101000"/></cfdi:Comprobante>'
      );
    });

    it('should serialize deeply nested children preserving order', () => {
      const root = new XmlElement('cfdi', 'Conceptos', 'ns');
      const c1 = new XmlElement('cfdi', 'Concepto', 'ns');
      c1.setAttribute('Importe', '100.00');
      const c2 = new XmlElement('cfdi', 'Concepto', 'ns');
      c2.setAttribute('Importe', '200.00');
      root.appendChild(c1);
      root.appendChild(c2);

      expect(root.toString()).toBe(
        '<cfdi:Conceptos><cfdi:Concepto Importe="100.00"/><cfdi:Concepto Importe="200.00"/></cfdi:Conceptos>'
      );
    });
  });

  describe('attributes', () => {
    it('should register attributes in insertion order', () => {
      const el = new XmlElement('cfdi', 'Comprobante', 'ns');
      el.setAttribute('Version', '4.0');
      el.setAttribute('Moneda', 'MXN');
      el.setAttribute('Total', '11600.00');

      expect(el.toString()).toBe('<cfdi:Comprobante Version="4.0" Moneda="MXN" Total="11600.00"/>');
    });

    it('should coerce numbers to string', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.setAttribute('n', 42);
      expect(el.toString()).toBe('<Foo n="42"/>');
    });

    it('should skip null and undefined attribute values', () => {
      const el = new XmlElement('cfdi', 'Comprobante', 'ns');
      el.setAttribute('A', '1');
      el.setAttribute('B', null);
      el.setAttribute('C', undefined);
      el.setAttribute('D', '2');

      expect(el.toString()).toBe('<cfdi:Comprobante A="1" D="2"/>');
    });

    it('XmlAttribute type is exported and usable', () => {
      const attr: XmlAttribute = { name: 'x', value: 'y' };
      expect(attr.name).toBe('x');
      expect(attr.value).toBe('y');
    });
  });

  describe('namespaces', () => {
    it('should declare xmlns:pago20 namespace', () => {
      const el = new XmlElement('cfdi', 'Comprobante', 'http://www.sat.gob.mx/cfd/4');
      el.declareNamespace('pago20', 'http://www.sat.gob.mx/Pagos20');

      expect(el.toString()).toBe(
        '<cfdi:Comprobante xmlns:pago20="http://www.sat.gob.mx/Pagos20"/>'
      );
    });

    it('should emit xmlns declarations before regular attributes', () => {
      const el = new XmlElement('cfdi', 'Comprobante', 'http://www.sat.gob.mx/cfd/4');
      el.setAttribute('Version', '4.0');
      el.declareNamespace('pago20', 'http://www.sat.gob.mx/Pagos20');

      expect(el.toString()).toBe(
        '<cfdi:Comprobante xmlns:pago20="http://www.sat.gob.mx/Pagos20" Version="4.0"/>'
      );
    });
  });

  describe('xsi:schemaLocation round-trip', () => {
    it('should write xsi:schemaLocation as a literal attribute name', () => {
      const el = new XmlElement('cfdi', 'Comprobante', 'http://www.sat.gob.mx/cfd/4');
      el.setAttribute(
        'xsi:schemaLocation',
        'http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd'
      );

      const serialized = el.toString();
      expect(serialized).toBe(
        '<cfdi:Comprobante xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"/>'
      );
      expect(serialized).toContain('xsi:schemaLocation="');
    });
  });

  describe('attribute escaping', () => {
    it('should escape ampersand in attribute values', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.setAttribute('q', 'a & b');
      expect(el.toString()).toBe('<Foo q="a &amp; b"/>');
    });

    it('should escape < and > in attribute values', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.setAttribute('q', '<x>><<');
      expect(el.toString()).toBe('<Foo q="&lt;x&gt;&gt;&lt;&lt;"/>');
    });

    it('should escape double quotes in attribute values', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.setAttribute('q', 'say "hi"');
      expect(el.toString()).toBe('<Foo q="say &quot;hi&quot;"/>');
    });

    it('should escape ampersand before other entities (correct order)', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.setAttribute('q', '<&>"');
      expect(el.toString()).toBe('<Foo q="&lt;&amp;&gt;&quot;"/>');
    });
  });

  describe('text escaping', () => {
    it('should escape ampersand in text content', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.appendChild('Tom & Jerry');
      expect(el.toString()).toBe('<Foo>Tom &amp; Jerry</Foo>');
    });

    it('should escape < and > in text content', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.appendChild('a < b > c');
      expect(el.toString()).toBe('<Foo>a &lt; b &gt; c</Foo>');
    });

    it('should NOT escape double quotes in text content', () => {
      const el = new XmlElement('', 'Foo', 'ns');
      el.appendChild('say "hi"');
      expect(el.toString()).toBe('<Foo>say "hi"</Foo>');
    });
  });

  describe('xmlDocument prolog', () => {
    it('should prepend the XML declaration and a newline', () => {
      const root = new XmlElement('cfdi', 'Comprobante', 'http://www.sat.gob.mx/cfd/4');
      root.setAttribute('Version', '4.0');

      expect(xmlDocument(root)).toBe(
        '<?xml version="1.0" encoding="UTF-8"?>\n<cfdi:Comprobante Version="4.0"/>'
      );
    });

    it('should handle nested document', () => {
      const root = new XmlElement('cfdi', 'Comprobante', 'ns');
      const emisor = new XmlElement('cfdi', 'Emisor', 'ns');
      emisor.setAttribute('Rfc', 'XAXX010101000');
      root.appendChild(emisor);

      expect(xmlDocument(root)).toBe(
        '<?xml version="1.0" encoding="UTF-8"?>\n<cfdi:Comprobante><cfdi:Emisor Rfc="XAXX010101000"/></cfdi:Comprobante>'
      );
    });
  });
});
