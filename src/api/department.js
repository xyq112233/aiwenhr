import request from '@/utils/request'

export function getDepartment() {
  return request({
    url: '/company/department'
  })
}
// 获取部门负责人
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}
// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
// 获取部门详情
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
