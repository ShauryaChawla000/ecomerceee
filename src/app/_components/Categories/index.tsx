import React from 'react'
import Link from 'next/link'

import { Category } from '../../../payload/payload-types'
import CategoryCard from './CategoryCard'

import classes from './index.module.scss'

const Categories = ({ categories }: { categories: Category[] | null | undefined }) => {
  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>Shop by Categories</h3>
        <Link href="/products">Show All</Link>
      </div>

      <div className={classes.list}>
        {categories && categories.length > 0 ? (
          categories.map(category => <CategoryCard key={category.id} category={category} />)
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </section>
  )
}

export default Categories
