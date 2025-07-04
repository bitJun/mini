import { useEffect, useState, useRef } from 'react';
import useShareMessage from '@/hooks/useShareMessage';
import Router, { _checkLogin } from '@/lib/router';
import {
  View,
  Image,
  Input,
  Text,
  ScrollView
} from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import fetch from '@/lib/request';
import styles from './search.module.scss';
import DigitalMan from '@/assets/generation/digital_man.png';
import RanageIcon from '@/assets/generation/ranage.png';
import SearchIcon from '@/assets/generation/search.png';
import ClearIcon from '@/assets/generation/clear.png';
import EmptyIcon from '@/assets/generation/empty.png';


definePageConfig({
  navigationBarTitleText: "营销发展员工", // 会被动态覆盖
  navigationStyle:"default",
  disableScroll: true,
  enableShareAppMessage: true,
  enableShareTimeline: true
});

interface ProductItem {
    id: number;
    name: string;
    label: Array<string>;
    image_url: string;
    category_text: string;
}

interface KnowledgesItem {
    id: number;
    title: string;
    content: string;
}
interface MaterialsItem {
    id: number;
    image_url: string;
    label: Array<string>;
}

const GenerationSearch = () => {

  const [keyword, setKeyword] = useState<string>('');
  const [tags, setTags] = useState<Array<string>>(['产品推广', '流量密码', '直播行业', '内容讲解', '方法论']);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [list, setList] = useState<Array<ProductItem>>([]);
  const [knowledgesList, setKnowledgesList] = useState<Array<KnowledgesItem>>([]);
  const [materialsList, setMaterialsList] = useState<Array<MaterialsItem>>([]);

  useShareMessage();
  useDidShow(() => {
    _checkLogin();
  });

  /**
   * keyword输入事件
   * @param e
   */
  const onChange = (e: any) => {
    setKeyword(e.detail.value);
  };

  /**
   * keyword清除事件
   */
  const onClear = () => {
    setKeyword('');
  };

  const onSearch = () => {
    if (keyword) {
        let params = {
            keyword: keyword
        }
        fetch.deliveryCustomerQueryProperty(params)
            .then(res=>{
                const [result, error] = res;
                if (error || !result) return;
                const {
                    knowledges,
                    products,
                    materials
                } = result;
                setList(products);
                setKnowledgesList(knowledges);
                setMaterialsList(materials);
                if (knowledges.length == 0 && products.length == 0 && materials.length == 0) {
                    setIsEmpty(true);
                } else {
                    setIsEmpty(false);
                }
            })
    }
  }

  return (
    <View className={styles.generation}>
        <View className={styles['generation_digital']}>
            <Image
                src={DigitalMan}
                className={styles['generation_digital_img']}
            />
            <View className={styles['generation_digital_main']}>
                <View className={styles['generation_digital_main_title']}>Hey，Maleah!</View>
                <View className={styles['generation_digital_main_desc']}>👇 这里帮您管理了您的企业数字资产！</View>
            </View>
            <Image
                src={RanageIcon}
                className={styles['generation_digital_icon']}
            />
        </View>
        <View className={styles['generation_box']}>
            <Image
                src={SearchIcon}
                className={styles['generation_box_icon']}
            />
            <Input
                className={styles['generation_box_search']}
                placeholder='告诉我，你想寻找什么...'
                value={keyword}
                onInput={(e)=>{onChange(e)}}
                placeholderClass={styles.placeholder}
                onConfirm={()=>{
                    onSearch()
                }}
            />
            {
                keyword ? (
                    <Image
                    src={ClearIcon}
                    className={styles['generation_box_clear']}
                    onClick={()=>{onClear()}}
                    />
                ) : null
            }
        </View>
        <ScrollView
            className={styles['generation_tags']}
            scrollX
        >
            {
            tags && tags.map((item: string, index: number) =>
                <View
                className={styles['generation_tags_item']}
                key={index}
                >
                {item}
                </View>
            )
            }
        </ScrollView>
        {
            keyword &&
            <View className={styles['generation_section']}>
                {
                    isEmpty ? (
                        <View className={styles['generation_section_empty']}>
                            <Image
                                src={EmptyIcon}
                                className={styles['generation_section_empty_img']}
                            />
                            <Text className={styles['generation_section_empty_text']}>抱歉！暂无搜索结果</Text>
                        </View>
                    ) : (
                        <ScrollView
                            className={styles['generation_section_main']}
                            scrollY={true}
                        >
                            {
                                list && list.length > 0 &&
                                <View className={styles['generation_section_main_box']}>
                                    <View className={styles['generation_section_main_title']}>产品</View>
                                    <View className={styles['generation_section_main_product']}>
                                        {
                                            list.map((item:ProductItem) =>
                                                <View
                                                    className={styles['generation_section_main_product_box']}
                                                    key={item.id}
                                                >
                                                    <Image
                                                        src={item.image_url}
                                                        className={styles['generation_section_main_product_box_img']}
                                                    />
                                                    <View
                                                        className={styles['generation_section_main_product_box_section']}
                                                    >
                                                        <View className={styles['generation_section_main_product_box_section_title']}>
                                                            {item.name}
                                                        </View>
                                                        <View className={styles['generation_section_main_product_box_section_tags']}>
                                                            {
                                                                item.label.map((json:string, index: number)=>
                                                                    <View
                                                                        className={styles['generation_section_main_product_box_section_tags_item']}
                                                                        key={index}
                                                                    >
                                                                        #{json}
                                                                    </View>
                                                                )
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            }
                            {
                                materialsList && materialsList.length > 0 &&
                                <View className={styles['generation_section_main_box']}>
                                    <View className={styles['generation_section_main_title']}>素材</View>
                                    <View className={styles['generation_section_main_materials']}>
                                        {
                                            materialsList.map((item:MaterialsItem) =>
                                                <View
                                                    className={styles['generation_section_main_materials_box']}
                                                    key={item.id}
                                                >
                                                    <Image
                                                        src={item.image_url}
                                                        className={styles['generation_section_main_materials_box_img']}
                                                    />
                                                    <View
                                                        className={styles['generation_section_main_materials_box_info']}
                                                    >
                                                        {
                                                            item.label.map((json: string, index: number) => 
                                                                <Text key={index}>{json}</Text>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            }
                            {
                                knowledgesList && knowledgesList.length > 0 &&
                                <View className={styles['generation_section_main_box']}>
                                    <View className={styles['generation_section_main_title']}>知识</View>
                                    <View className={styles['generation_section_main_knowledges']}>
                                        {
                                            knowledgesList.map((item:KnowledgesItem) =>
                                                <View
                                                    className={styles['generation_section_main_knowledges_box']}
                                                    key={item.id}
                                                >
                                                    <View className={styles['generation_section_main_knowledges_box_title']}>
                                                        {item.title}
                                                    </View>
                                                    <View className={styles['generation_section_main_knowledges_box_desc']}>
                                                        {item.content}
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    )
                }
            </View>
        }
    </View>
  );
};

export default GenerationSearch;
