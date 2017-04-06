import * as React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

describe('Test jsx compilation', () => {
  it('Should have compiled this test', () => {
    expect(shallow(<div />)).to.have.type('div')
  })
})
