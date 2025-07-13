export const DepartmentsService = {
  async list() {
    return Promise.resolve([
      {
        departmentID: 'd1',
        departmentName: 'Departamento de Ingeniería Civil',
        departmentType: 'Académico',
        facultyID: 'f1'
      },
      {
        departmentID: 'd2',
        departmentName: 'Departamento de Psicología',
        departmentType: 'Académico',
        facultyID: 'f2'
      },
      {
        departmentID: 'd3',
        departmentName: 'Departamento de Medicina General',
        departmentType: 'Académico',
        facultyID: 'f3'
      },
      {
        departmentID: 'd4',
        departmentName: 'Departamento de Cortar el Pelo',
        departmentType: 'Académico',
        facultyID: 'f4'
      }
    ]);
  },

  async create(department) {
    console.log('Guardando departamento', department);
    return Promise.resolve();
  }
};
