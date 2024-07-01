import { filterCategory } from "@/types";
import { Select, SelectItem } from "@nextui-org/react";
import { FC, useEffect, ChangeEvent } from "react";
import { category, subCategory } from "@/types";

type INewCategory = {    
    categories: filterCategory[];
    category: string;
    subCategory: string; 
    subSubCategory: string | undefined;
    changeClassificiation: (newName:string, level:"category" | "subCategory" | "subSubCategory") => void;   
    isReadonly: boolean;
}

export const NewItemCategory:FC<INewCategory> = ({
    categories, category, subCategory, subSubCategory, changeClassificiation, isReadonly}) => {    

    const categoryIdx = categories.findIndex((dCat:category) => dCat.name === category)
    const subCategories = categoryIdx > -1?categories[categoryIdx].subCategory:[]
    const subCategoryIdx = subCategories.findIndex((dSub:subCategory) => dSub.name === subCategory)
    const subSubCategories = typeof subCategories[subCategoryIdx] !== "undefined"?
        subCategories[subCategoryIdx].subCategory:
            []

    const hasSubSubCategories = Array.isArray(subSubCategories) && subSubCategories.length > 0

    useEffect(()=>{
        if(category === ""){
            changeClassificiation(categories[0].name, "category")
            changeClassificiation(categories[0].subCategory[0].name, "subCategory")
            if(subSubCategory && subSubCategory !== ""){
                changeClassificiation(hasSubSubCategories?subSubCategories[0].name:"", "subSubCategory")
            }
        }
                
    }, [])
            
    const styles = hasSubSubCategories?
        "basis-full md:basis-1/3":"basis-full md:basis-1/2"            

    return (
        <div className="flex flex-wrap">
            <Select                        
                label="Kategori"
                variant="bordered"
                selectedKeys={[category]}
                className={styles}
                onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                    changeClassificiation(e.target.value, "category")
                }}                
            >
                {categories.map((c) => (
                    <SelectItem key={c.name} isReadOnly={isReadonly}>
                        {c.name}
                    </SelectItem>
                    ))}
            </Select>
            <Select                        
                label="Sub Kategori"
                variant="bordered"
                selectedKeys={[subCategory]}
                className={styles}
                onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                    changeClassificiation(e.target.value, "subCategory")
                }}
                isDisabled={isReadonly}
            >
                {subCategories.map((c) => (
                    <SelectItem key={c.name}>
                        {c.name}
                    </SelectItem>
                    ))}
            </Select>
            {
                hasSubSubCategories && 
                <Select                        
                    label="Sub Sub Kategori"
                    variant="bordered"
                    selectedKeys={[subSubCategory?subSubCategory:""]}
                    className={styles}
                    onChange={(e:ChangeEvent<HTMLSelectElement>)=>{
                        changeClassificiation(e.target.value, "subSubCategory")
                    }}
                    isDisabled={isReadonly}
                >
                    {subSubCategories.map((c) => (
                        <SelectItem key={c.name}>
                            {c.name}
                        </SelectItem>
                        ))}
                </Select>
            }
        </div>

    )
}