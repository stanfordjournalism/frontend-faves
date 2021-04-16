const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQskn1VYGP0QpwFMSsLzQyvezxgvSZyO_WPCFQACXwwqTIsAuORA4apx-EPKtCHVqSWWkYfTU49C6qp/pub?gid=1772463569&single=true&output=csv";

function classAttr(attrs) {
  return attrs
    .map(attr => attr.replace(' ', '_'))
    .join(' ');
};

class Card {
  constructor(data) {
    this.data = data;
  }
  iconImageEl() {
    let iconFileName = this.data.icon || 'code_black_24dp.svg';
    let imageTag = `<img class="icon" src="/images/${iconFileName}"
      alt="source logo"`
    if (iconFileName.startsWith('code_black_24dp')) {
      imageTag += ' width=32px height=32px';
    }
    imageTag += '>';
    return imageTag;
  }
  render() {
    return `
    <h2>
      <a href=${this.data.url} target="_blank">${this.data.title}</a>
    </h2>
    ${this.iconImageEl()}
    <div class="blurb">${this.data.blurb}</div>`;
  }
}

d3.csv(dataUrl, function(data) {
  return {
    title: data.title,
    author: data.author_or_source,
    url: data.site,
    blurb: data.blurb,
    tags: data.technology.split(',').map(item => item.trim()),
    format: data.format,
    level: data.level,
    icon: data.icon,
  };
}).then(function(data) {
  let tags = new Set(
    data
      .reduce((acc, curVal) => acc.concat(curVal.tags), [])
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  );
  d3.select('.tags')
    .selectAll('div')
    .data(tags)
    .join('div')
      .attr('class', 'tag')
      .text(d => d);

  let container = d3.select('.content');
  container.selectAll('div')
    .data(data)
    .join('div')
      .attr('class', d => classAttr(['item'].concat(d.tags)))
      .html(d => new Card(d).render());
});
