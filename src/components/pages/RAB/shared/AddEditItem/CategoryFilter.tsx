import React, { useEffect, useState, FC, ChangeEvent } from "react";
import _ from "lodash";
import { Select, SelectItem, Selection} from "@nextui-org/react";
import { filterCategory, filterSubCategory, filterOption } from "@/types";

type ICategoryFilter = {
    categories: filterCategory[];
}

export const CategoryFilter:FC<ICategoryFilter> = ({ categories: baseCategories }) => {
    const [ categories, setCategories ] = useState<Selection>(new Set([]))
    const [ subCategories, setSubCategories] = useState<Selection>(new Set([]))
    const [ subSubCategories, setSubSubCategories] = useState<Selection>(new Set([]))
    
    const categoryNames = baseCategories.filter((d: filterCategory) => d.checked).map((d:filterCategory) => d.name)
    const baseSubCategories = baseCategories.map((d:filterCategory) => d.subCategory).flat()
    const subCategoryNames = baseSubCategories.filter((d:filterSubCategory) => d.checked).map((d:filterSubCategory) => d.name)
    const baseSubSubCategories = baseSubCategories.filter((d:filterSubCategory) => Array.isArray(d.subCategory))
        .map((d:filterSubCategory) => d.subCategory).flat()
    const subSubCategoryNames = baseSubSubCategories.filter((d:filterOption | undefined) => d && d.checked)
            .map((d:filterOption | undefined) => d && d.name)        

    const changeCategories = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategories(new Set(e.target.value.split(",")));
    };

    const changeSubCategories = (e: ChangeEvent<HTMLSelectElement>) => {
        
    };

    const changeSubSubCategories = (e: ChangeEvent<HTMLSelectElement>) => {
        
    };

    useEffect(()=>{
        const categories = new Set(categoryNames)
        setCategories(categories)
        const subCategories = new Set(subCategoryNames)
        setSubCategories(subCategories)
        if(subSubCategoryNames.length > 0){
            const subSubCategories = new Set(subSubCategoryNames)
            setSubSubCategories(subSubCategories as Selection)           
        }
    }, [])

    const withSubSubCategories = baseSubSubCategories.length > 0
    const styles = !withSubSubCategories?
        "basis-full md:basis-1/2 overflow-hidden":
            "basis-full md:basis-1/3 overflow-hidden"

    return (
        <div className="flex flex-wrap">
            <Select
                label="Kategori"
                selectionMode="multiple"
                placeholder="Pilih Kategori"
                selectedKeys={categories}
                className={styles}
                onChange={changeCategories}                
            >
                {baseCategories.map((c) => (
                <SelectItem key={c.name} isReadOnly>
                    {c.name}
                </SelectItem>
                ))}
            </Select>
            <Select
                label="Sub Kategori"
                selectionMode="multiple"
                placeholder="Pilih Sub Kategori"
                selectedKeys={subCategories}
                className={styles}
                onChange={changeSubCategories}                
            >
                {baseSubCategories.map((c) => (
                    <SelectItem key={c.name} isReadOnly>
                        {c.name}
                    </SelectItem>
                ))}
            </Select>
            {
                withSubSubCategories &&
                <Select
                    label="Sub Sub Kategori"
                    selectionMode="multiple"
                    placeholder="Pilih Sub Sub Kategori"
                    selectedKeys={subSubCategories}
                    className={styles}
                    onChange={changeSubSubCategories}                
                >
                    {baseSubSubCategories.map((c) => {
                        const { name } = c as filterOption
                        return (
                            <SelectItem key={name} isReadOnly>
                                {name}
                            </SelectItem>
                        )
                    })}
                </Select>
            }
        </div>   
    )
}