package com.szusta.meduva.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Table(name = "equipment_model")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentModel extends Undeletable {

    private String name;

    @OneToMany(mappedBy = "equipmentModel")
    @JsonIgnore
    private Set<EquipmentItem> equipmentItems;

    public EquipmentModel(String name, boolean deleted) {
        this.name = name;
        this.deleted = deleted;
    }
}
