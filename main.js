const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQskn1VYGP0QpwFMSsLzQyvezxgvSZyO_WPCFQACXwwqTIsAuORA4apx-EPKtCHVqSWWkYfTU49C6qp/pub?gid=1772463569&single=true&output=csv";

function classAttr(attrs) {
  return attrs
    .map(attr => attr.replace(' ', '_'))
    .join(' ');
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

class Tags {
  constructor() {
    //this.tags_el = document.querySelect('.tags');
  }
  filter(t) {
    //this.tags_el = document.querySelect('.tags');
    console.log(t);
  }
}


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

  let container = d3.select('.content');
  container.selectAll('article')
    .data(data)
    .join('article')
      .attr('class', d => classAttr(d.tags))
      .html(d => new Card(d).render());

  let tags = new Set(
    data
      .reduce((acc, curVal) => acc.concat(curVal.tags), [])
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  );

  d3.select('.tags')
    .selectAll('div')
    .data(tags)
    .join('div')
      .attr('class', d => `tag ${d.replace(' ', '_')}`)
      .text(d => d);

  d3.selectAll('.tags div')
    .on('click', function(event, tag) {
      // Standardize class name
      let tag_text = tag.replace(' ', '_');
      // Add/remove tag_text from active_tags
      document
        .querySelector('#active_tags')
        .classList
        .toggle(tag_text);

      let all_tag_names = new Set();
      document.querySelectorAll('.tags div').forEach(function(node) {
          all_tag_names.add(node.innerText.replace(' ', '_'));
      })
      // Get the inactive tags by performing a set operation
      let active_tag_names = Array.from(
        document.querySelector('#active_tags').classList
      );
      let inactive_tags = difference(all_tag_names, new Set(active_tag_names));
      // Toggle class on tag element
      this.classList.toggle('active');
      if (active_tag_names.length > 0) {
      // Hide articles that do not have any active tags
        nodes = document.querySelectorAll('article');
        nodes.forEach(node => {
          nodeClasses = new Set(Array.from(node.classList));
          let has_active_tags = Array.from(intersection(new Set(active_tag_names), nodeClasses)).length > 0;
          if (has_active_tags === false) {
            node.dataset.status = 'hide';
          } else {
            node.dataset.status = null;
          }
        })
      } else {
        document.querySelectorAll('article').forEach(node => node.dataset.status = null);
      };
    }); // close on click handler

});
