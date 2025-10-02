// اختبار بسيط للحلقات المتداخلة
const JHTM = require('./jhtm.js');

async function testNestedLoops() {
  const template = `
<div>
  @each(employees as employee)
    <h3>{{employee.name}}</h3>
    <ul>
      @each(employee.skills as skill)
        <li>{{skill}}</li>
      @endeach
    </ul>
  @endeach
</div>
  `;

  const data = {
    employees: [
      {
        name: 'أحمد',
        skills: ['JavaScript', 'React', 'Node.js']
      },
      {
        name: 'سارة',
        skills: ['Python', 'Django', 'PostgreSQL']
      }
    ]
  };

  const jhtm = new JHTM(() => template, data);
  const html = await jhtm.render();
  console.log(html);
}

testNestedLoops();
